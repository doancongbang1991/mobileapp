class Color
    constructor: (@c, @m, @y) ->

    copy: () ->
        return new Color(@c, @m, @y)

    set: (@c, @m, @y) ->

    add: (c) ->
        @c += c.c
        @m += c.m
        @y += c.y
        @c = Math.min(@c, 1)
        @m = Math.min(@m, 1)
        @y = Math.min(@y, 1)

    hex: () ->
        r = 1 - @c
        g = 1 - @m
        b = 1 - @y
        r = Math.round(r * 255)
        g = Math.round(g * 255)
        b = Math.round(b * 255)
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)

    sameAs: (b) ->
        return Math.abs(@c - b.c) + Math.abs(@m - b.m) + Math.abs(@y - b.y) < 0.01

    apply: (e) ->
        $(e).css 'background-color': @hex()
        if $(e).hasClass('square')
            $(e).css 'color': @hex()


class Square
    constructor: (@dom) ->
        @active = false
        @setColor(new Color(1,1,1))

    activate: () ->
        @active = true
        @dom.addClass('pulse')

    hide: () ->
        @dom.addClass('hide')
        @dom.removeClass('pulse')

    setColor: (c) ->
        @color = c.copy()
        @color.apply(@dom)


class Board
    constructor: (@dom, @game) ->
        @width = 8
        @height = 8

    generate: (currentColor, stepsCount, mixins) ->
        @dom.empty()
        colors = [currentColor, new Color(0.5,0.5,0), new Color(0.5,1.0,0), new Color(1.0,1.0,1.0)]
        @squares = []

        markSet = (x, y) =>
            @squares[y][x].set = true
            @squares[y][x].setNeighbor = false
            for i in [0...4]
                dx = [-1,0,1,0][i]
                dy = [0,1,0,-1][i]
                if x + dx in [0...@width] and y + dy in [0...@height]
                    @squares[y+dy][x+dx].setNeighbor = not @squares[y+dy][x+dx].set
            

        for y in [0...@width]
            @squares.push []
            for x in [0...@height]
                square = new Square($("""
                    <div class="square">
                    </div>
                """))
                #square.setColor(colors[Math.floor(Math.random() * colors.length)])
                @squares[y].push square
                @dom.append(square.dom)
            @dom.append("""<div class="newline"></div>""")

        initialX = Math.floor(Math.random() * @width)
        initialY = Math.floor(Math.random() * @height)
        @squares[initialY][initialX].setColor(currentColor)
        markSet(initialX, initialY)
        @squares[initialY][initialX].activate()

        totalSquares = @width * @height

        #---
        squareCounts = []
        for step in [1..stepsCount]
            squareCounts.push 0
        for i in [1..totalSquares-1]
            squareCounts[Math.floor(Math.random() * squareCounts.length)]++

        color = currentColor.copy()
        console.log mixins
        for step in [0..stepsCount-1]
            goodMixins = [null]
            for mixin in mixins
                c = color.copy()
                c.add mixin
                if not c.sameAs(color)
                    goodMixins.push mixin
            
            if goodMixins.length
                mixin = goodMixins[Math.floor(Math.random() * goodMixins.length)]
                if mixin == null
                    color.set(0,0,0)
                else
                    color.add mixin
            else
                color.set(0,0,0)

            console.log 'Step', step, 'color', color.hex()
            for i in [1..squareCounts[step]]
                c = 0
                while true
                    c += 1
                    if c > 1000
                        console.log 'infinite', i, squareCounts[step]
                        return
                    x = Math.floor(Math.random() * @width)
                    y = Math.floor(Math.random() * @height)
                    sq = @squares[y][x]
                    if sq.setNeighbor
                        sq.setColor(color)
                        markSet(x, y)
                        break
        
        @update(currentColor)

    update: (currentColor) ->
        while true
            @completed = 0
            needsAnotherRun = false
            for y in [0...@width]
                for x in [0...@height]
                    sq = @squares[y][x]
                    if sq.active
                        @completed += 1
                        sq.setColor(currentColor)
                        for i in [0..3]
                            dx = [-1,0,1,0][i]
                            dy = [0,1,0,-1][i]
                            if x + dx in [0...@width] and y + dy in [0...@height]
                                sq2 = @squares[y+dy][x+dx]
                                if not sq2.active
                                    if sq2.color.sameAs(currentColor)
                                        needsAnotherRun = true
                                        sq2.activate()
            if not needsAnotherRun
                break
        
        allSame = true
        for y in [0...@width]
            for x in [0...@height]
                sq = @squares[y][x]
                allSame &= @squares[0][0].color.sameAs(sq.color)

        if allSame
            setTimeout () =>
                for y in [0...@width]
                    for x in [0...@height]
                        @squares[y][x].hide()
            , 1000
            @completed = 64
            @game.win()


class Game
    constructor: () ->
        @board = new Board($('#board'), this)

    start: () ->
        @currentColor = new Color(0,0,0)
        @turnsTotal = 5
        @turnsUsed = 0

        mixins = [new Color(0.5,0,0), new Color(0,0.5,0), new Color(0,0,0.5)]

        mixinBox = $('#mixins')
        mixinBox.find('.mixin').remove()
        
        for mixin in mixins
            button = $("""
                <a class="mixin">
                    <i class="fa fa-plus"></i>
                </a>
            """)
            mixin.apply(button)
            mixinBox.append(button)

            ((mixin) =>
                button.click () =>
                    old = @currentColor.copy()
                    @currentColor.add(mixin)
                    if not @currentColor.sameAs(old)
                        @updateCurrentColor()
                        @consumeTurn()
            )(mixin)


        button = $("""
            <a class="mixin">
                <i class="fa fa-repeat"></i>
            </a>
        """)
        new Color(0,0,0).apply(button)
        mixinBox.append(button)
        button.click () =>
            @currentColor.c = 0
            @currentColor.m = 0
            @currentColor.y = 0
            @updateCurrentColor()
            @consumeTurn()

        @board.generate(@currentColor, @turnsTotal, mixins)
        @updateCurrentColor()
        @updateTurnCounter()

    lose: () ->
        $('#dialog-lost').show()

    win: () ->
        $('#dialog-won').show()

    updateCurrentColor: () ->
        @currentColor.apply($('#current-color'))
        @board.update(@currentColor)

    consumeTurn: () ->
        if @turnsUsed == @turnsTotal
            @lose()
        else
            @turnsUsed += 1
            @updateTurnCounter()

    updateTurnCounter: () ->
        $('#turn-counter .spinner').text("#{@turnsTotal - @turnsUsed}")
        $('#progress .spinner').text("#{Math.floor(@board.completed * 100 / 64)}")





$ () ->
    $('.modal').click () ->
        $(this).hide()

    g = new Game()
    g.start()
    window.game = g

    $('.retry').click () ->
        g.start()