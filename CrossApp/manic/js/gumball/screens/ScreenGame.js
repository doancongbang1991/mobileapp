/**
 * Created by pawel on 08.05.2014.
 */
var Levels =
{
    DEFS: [
//        {onStart: [1, 2, 1], customers:40, spawnTime: 4, customerTypes: 4, maxSpawn: 12, time: 90},
        {onStart: [1, 2, 1], customers:10, spawnTime: 6, customerTypes: 2, maxSpawn: 2, time: 50},
        {onStart: [1, 1, 2], customers:15, spawnTime: 6, customerTypes: 2, maxSpawn: 3, time: 55},
        {onStart: [1, 3, 2], customers:20, spawnTime: 5.5, customerTypes: 2, maxSpawn: 4, time: 60},
        {onStart: [2, 2, 3], customers:25, spawnTime: 5.5, customerTypes: 3, maxSpawn: 5, time: 65},
        {onStart: [2, 3, 2], customers:30, spawnTime: 5, customerTypes: 3, maxSpawn: 6, time: 70},
        {onStart: [3, 3, 3], customers:35, spawnTime: 5, customerTypes: 3, maxSpawn: 7, time: 80},
        {onStart: [3, 3, 3], customers:40, spawnTime: 4.5, customerTypes: 4, maxSpawn: 8, time: 90},
        {onStart: [3, 4, 3], customers:43, spawnTime: 4.5, customerTypes: 4, maxSpawn: 9, time: 100},
        {onStart: [4, 3, 4], customers:47, spawnTime: 4.5, customerTypes: 4, maxSpawn: 10, time: 110},
        {onStart: [4, 4, 4], customers:50, spawnTime: 4, customerTypes: 4, maxSpawn: 10, time: 120}
    ]
};

var ScreenGame =
{

    BENCH_END: [840, 840, 840],
    STATE_ACTION: 0,
    STATE_OVER_FAILED: 1,
    STATE_OVER_SUCCESS: 2,

    CUSTOMERS_ON_STAGE: 17,

    s_container: createjs.Container,
    s_benches: Array,
    s_hero: Hero,
    s_customers: Array,
    s_vegs:Array,
    s_moneys:Array,
    s_level: 0,
    s_spawnTime: 5,
    s_spawnTimer: 0,
    s_state: 0,
    s_timer: 0,
    s_time: 0,
    s_totalTime: 0,
    s_points: 0,
    s_lives: 0,
    s_customersToAdd: 0,


    Init: function ()
    {
        this.s_container = new createjs.Container();
        Main.s_scene.addChild(this.s_container);

        //
        this.s_benches = [];
        this.s_customers = [];
        this.s_vegs = [];
        this.s_moneys = [];

        this.s_lives = Status.s_lives;
        this.s_points = Status.s_points;

        //setup level assets
        this.s_bg = new createjs.Bitmap(Main.GetImage("background"));
        this.s_container.addChild(this.s_bg);

        var pos = [{x: -90, y: 139}, {x: -45, y: 316}, {x: 0, y: 495}];
        for(var i = 0; i < 3; i++)
        {
            this.s_benches[i] = new createjs.Container();
            this.s_benches[i].x = pos[i].x;
            this.s_benches[i].y = pos[i].y;
            this.s_container.addChild(this.s_benches[i]);
            var bench = new createjs.Bitmap(Main.GetImage("bench"));
            this.s_benches[i].addChild(bench);
        }

        //
        Hud.Init();
        Hud.ShowLives(this.s_lives);
        Hud.ShowPoints(this.s_points);

        //
        this.s_hero = new Hero();
        this.s_container.addChild(this.s_hero);
        this.s_hero.setOnSpot();

        //controller
        if (Main.IsMobile())
        {
            ControllerTouch.Init(this.s_hero, this.s_container);
        }
        else
        {
            Main.s_stage.enableMouseOver(5);
            //ControllerTouch.Init(this.s_hero);
            ControllerKeyboard.Init(this.s_hero);
        }

        //
        this.InitLevel(Status.s_level);

        //
        var size = Main.GetCanvasSize();
        this.UpdateCanvasSize(size.width, size.height);

        //
        Main.s_stage.update();

        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", GameUpdate);

        //
        if (Main.s_music.getPosition() == 0)
        {
            Main.s_music = SoundsManager.PlaySound("theme", {loop: -1, volume: 1});
        }

        //
        return this;
    },


        Remove: function()
        {
            createjs.Tween.removeAllTweens();

            createjs.Ticker.removeEventListener("tick", GameUpdate);

            Hud.Remove();

            //remove
            for (var i = 0; i < this.s_customers.length; i++)
            {
                this.s_customers[i].remove();
            }

            for (i = 0; i < this.s_vegs.length; i++)
            {
                this.s_vegs[i].remove();
            }

            for (i = 0; i < this.s_moneys.length; i++)
            {
                this.s_moneys[i].remove();
            }

            //
            this.s_hero.remove();

            //
            //SoundsManager.StopAll();

            //
            if (Main.IsMobile())
            {
                ControllerTouch.Clear();
            }
            else
            {
                //ControllerTouch.Clear();
                ControllerKeyboard.Clear();
            }

            //
            for (i = 0; i < 3; i++)
            {
                this.s_benches[i].removeAllChildren();
            }


            this.s_container.removeAllChildren();

            Main.s_stage.removeChild(this.s_container);

            Main.s_stage.update();

            this.s_bg = null;
            this.s_benches = null;

            delete this;
        },


        InitLevel: function(level)
        {
            this.s_level = level;
            var def = Levels.DEFS[this.s_level];
            this.s_customersToAdd = def.customers;
            this.s_spawnTime = def.spawnTime;
            this.s_spawnTimer = parseInt(this.s_spawnTime * 30);
            this.s_time = this.s_totalTime = parseInt(def.time * 30);
            Hud.ShowTime(this.s_time / this.s_totalTime);

            //
            this.m_customersPool = "";
            for (var i = 0; i < def.customerTypes; i++)
            {
                this.m_customersPool += i;
            }
            this.m_customersPool += "456789";
            this.InitCurrentPool();

            this.m_benchCustomers = [];
            //place customers
            for (i = 0; i < 3; i++)
            {
                this.m_benchCustomers[i] = "";
                for (var j = 0; j < def.onStart[i]; j++)
                {
                    this.AddCustomer(i, j, def.onStart[i]);
                }
            }

            //
            this.s_state = this.STATE_ACTION;
        },


        InitCurrentPool: function()
        {
            this.m_currentPool = this.m_customersPool;
            /*for (var i = 0; i < this.m_customersPool.length; i++)
            {
                this.m_currentPool += this.m_customersPool[i];
            }*/

        },


        Pause: function()
        {
            if (this.s_benches.length > 1)
            {
                createjs.Ticker.removeEventListener("tick", GameUpdate);
            }
        },


        Resume: function()
        {
            if (this.s_benches.length > 1)
            {
                createjs.Ticker.addEventListener("tick", GameUpdate);
            }
        },


        BackFromRotate: function()
        {
            this.Resume();
        },


        Update: function(e)
        {
            //update
            this.s_hero.update();

            switch (this.s_state)
            {
                case this.STATE_ACTION:
                    //time
                    this.s_time--;
                    Hud.ShowTime(this.s_time / this.s_totalTime);
                    if (this.s_time <= 0)
                    {
                        //time out
                        this.GameFailed();
                        return;
                    }

                    //spawn new customers
                    this.s_spawnTimer--;
                    if (this.s_spawnTimer <= 0)
                    {
                        this.SpawnWave();
                        this.s_spawnTimer = parseInt(this.s_spawnTime * 30);
                    }

                    //update
                    for (var i = 0; i < this.s_vegs.length; i++)
                    {
                        this.s_vegs[i].update();
                    }

                    for (i = 0; i < this.s_customers.length; i++)
                    {
                        this.s_customers[i].update();
                    }

                    for (i = 0; i < this.s_moneys.length; i++)
                    {
                        this.s_moneys[i].update();
                    }
                    break;

                case this.STATE_OVER_FAILED:
                    this.s_timer--;
                    if (this.s_timer <= 0)
                    {
                        this.s_lives--;
                        Hud.ShowLives(this.s_lives);

                        Status.s_points = this.s_points;
                        if (this.s_lives <= 0)
                        {
                            Main.s_best = Math.max(Main.s_best, Status.s_points);
                            Navigation.ShowScreen(Navigation.SCREEN_FAILED);
                        }
                        else
                        {
                            //try again
                            Status.s_lives = this.s_lives;
                            Navigation.ShowScreen(Navigation.SCREEN_GAME);
                        }
                    }
                    break;

                case this.STATE_OVER_SUCCESS:
                    this.s_timer--;
                    if (this.s_timer <= 0)
                    {
                        //next level
                        Main.s_best = Math.max(Main.s_best, Status.s_points);
                        Status.s_nextLevel = true;
                        Navigation.ShowScreen(Navigation.SCREEN_SUMMARY);
                    }
                    break;
            }


            Main.s_stage.update(e);
    },


    PlaceVegOnBench: function(benchId)
    {
        var veg = new Veg(benchId, this.s_hero);
        veg.x = this.BENCH_END[benchId] - 30;
        this.s_benches[benchId].addChild(veg);
        veg.rollToCustomer();
        this.s_vegs.push(veg);
    },


    ReturnVegOnBench: function(veg, customer, benchId)
    {
        var pos = customer.localToGlobal(0, 0);
        pos = this.s_benches[benchId].globalToLocal(pos.x, pos.y);
        veg.x = pos.x + 40;
        this.s_benches[benchId].addChild(veg);
        veg.rollBack();
    },


    RemoveVeg: function(veg)
    {
        for (var i = 0; i < this.s_vegs.length; i++)
        {
            if (this.s_vegs[i] == veg)
            {
                this.s_vegs.splice(i, 1);
                return;
            }
        }
    },


    AddMoneyToBench: function(customer, benchId)
    {
        var money = new Money(benchId, this.s_hero);
        var pos = customer.localToGlobal(0, 0);
        pos = this.s_benches[benchId].globalToLocal(pos.x, pos.y);
        money.x = pos.x + 40;

        this.s_benches[benchId].addChild(money);
        this.s_moneys.push(money);
    },


    RemoveMoney: function(money)
    {
        for (var i = 0; i < this.s_moneys.length; i++)
        {
            if (this.s_moneys[i] == money)
            {
                this.s_moneys.splice(i, 1);
                return;
            }
        }
    },


    SpawnWave: function()
    {
        var max = Math.round((0.6 + (parseInt(5 * Math.random())) / 10) * Levels.DEFS[this.s_level].maxSpawn);
        var space = this.CUSTOMERS_ON_STAGE - this.s_customers.length;
        max = Math.min(max, space);
        var maxOnBench = Math.ceil(max / 3);
        var onBench = [0, 0, 0];
        //draw customers on bench
        for (var i = 0; i < max; i++)
        {
            do
            {
                var ind = parseInt(3 * Math.random());
            }
            while (onBench[ind] >= maxOnBench);
            onBench[ind]++;
        }

        //place customers
        for (var i = 0; i < 3; i++)
        {
            for (var j = 0; j < onBench[i]; j++)
            {
                this.AddCustomer(i, j, onBench[i]);
            }
        }
    },


    AddCustomer: function(benchId, ind, waveLength)
    {
        if (this.s_customersToAdd > 0)
        {
            this.s_customersToAdd--;

            var dx = 100;//70 + 30 * Math.random() | 0;
            dx += ind * 120;
            var id;

            //
            if (this.m_currentPool.length > 0 && Math.random() > 0.3)
            {
                //place unique character
                var onBench = this.m_benchCustomers[benchId];
                var toDraw = this.m_currentPool;
                //remove chars on table from draw pool
                for (var i = 0; i < onBench.length; i++)
                {
                    var ind = toDraw.indexOf(onBench.charAt(i));
                    if (ind > -1)
                    {
                        toDraw = toDraw.substring(0, ind) + toDraw.substring(ind + 1);
                    }
                }
                //draw char id
                id = toDraw.charAt(toDraw.length * Math.random() | 0);
                //update current pool
                ind = this.m_currentPool.indexOf(id);
                this.m_currentPool = this.m_currentPool.substring(0, ind) + this.m_currentPool.substring(ind + 1);
                /*if (this.m_currentPool.length == 0)
                 {
                 this.InitCurrentPool();
                 }*/
                //update bench
                this.m_benchCustomers[benchId] += id;
            }
            else
            {
                //place soda
                id = 10;

            }
            //
            var customer = new Customer(id, benchId, dx, this.s_vegs);
            customer.x = -customer.getWidth() / 2 - this.s_benches[benchId].x + dx - (waveLength * 120 + 85);
            this.s_benches[benchId].addChildAt(customer, 0);
            //customer.goForward();
            this.s_customers.push(customer);
        }
    },


    ReturnCustomer: function(type, benchId)
    {
        //return customer type to pool
        /*if (this.m_currentPool.length == Levels.DEFS[this.s_level].customerTypes + 6)
        {
            this.m_currentPool = "" + type;
        }
        else if (this.m_currentPool.indexOf(type) == -1)
        {
            this.m_currentPool += "" + type;
        }*/

        if (type < 10)
        {
            this.m_currentPool += "" + type;

            var onBench = this.m_benchCustomers[benchId];
            var ind = onBench.indexOf(type);
            onBench = onBench.substring(0, ind) + onBench.substring(ind + 1);
            this.m_benchCustomers[benchId] = onBench;
        }

    },


    RemoveCustomer: function(customer, benchId)
    {
        //remove from customers table
        for (var i = 0; i < this.s_customers.length; i++)
        {
            if (this.s_customers[i] == customer)
            {
                this.s_customers.splice(i, 1);
                return;
            }
        }
    },


    OnGoodByCustomer: function(customer, benchId)
    {
        this.ReturnCustomer(customer.m_type, benchId);

        //
        if (customer.m_type < 4)
        {
            var pos = customer.localToGlobal(0, 0);
            pos = this.s_container.globalToLocal(pos.x, pos.y);
            var points = [20, 20, 35, 50];
            this.AddPoints(points[customer.m_type], 50, pos.y);

            //
            Status.s_customers[customer.m_type].amount++;
            Status.s_customers[customer.m_type].points = points[customer.m_type];
        }

        if (this.s_customers.length == 1)
        {
            this.GameSuccess();
        }
    },


    GameFailed: function()
    {
        this.s_state = this.STATE_OVER_FAILED;

        this.StopAllObjects();
        this.s_hero.makeAngry();

        this.s_timer = 60;

        Status.s_points = this.s_points;

        Main.s_music.stop();

        //SoundsManager.PlaySound("fail");
    },


    GameSuccess: function()
    {
        this.s_state = this.STATE_OVER_SUCCESS;

        this.StopAllObjects();
        this.s_hero.makeHappy();

        this.s_timer = 72;

        Main.s_music.stop();
        SoundsManager.PlaySound("money_count");

        //
        Status.s_level = this.s_level + 1;
        Status.s_points = this.s_points;
        Status.s_lives = this.s_lives;
    },


    StopAllObjects: function()
    {
        for (var i = 0; i < this.s_vegs.length; i++)
        {
            this.s_vegs[i].stop();
        }

        for (i = 0; i < this.s_customers.length; i++)
        {
            this.s_customers[i].stop();
        }

        for (i = 0; i < this.s_moneys.length; i++)
        {
            this.s_moneys[i].stop();
        }
    },


    OnPlaceHeroOnSpot: function(spot)
    {
        this.s_container.removeChild(this.s_hero);
        this.s_container.addChildAt(this.s_hero, 1 + this.s_container.getChildIndex(this.s_benches[spot]));
    },


    OnCollectMoney: function(money)
    {
        Status.s_customers[4].amount++;
        Status.s_customers[4].points = 500;

        var pos = money.localToGlobal(0, 0);
        pos = this.s_container.globalToLocal(pos.x, pos.y);
        this.AddPoints(500, pos.x, pos.y);
    },


    AddPoints: function(value, posX, posY)
    {
        this.s_points += value;
        Hud.ShowPoints(this.s_points);

        var cloud = new PointsCloud(value, posX, posY);
        this.s_container.addChild(cloud);
    },


    ShowHelp: function()
    {
        createjs.Ticker.removeEventListener("tick", GameUpdate);
        if (Main.IsMobile())
        {
            ControllerTouch.Clear();
        }
        else
        {
            ControllerKeyboard.Clear();
        }

        //
        Hud.Lock();

        //
        this.s_help = ScreenInstructions.Init(true);
    },


    OnCloseHelp: function()
    {
        this.s_help.Remove();
        this.s_help = null;

        Hud.Unlock();

        createjs.Ticker.addEventListener("tick", GameUpdate);

        if (Main.IsMobile())
        {
            ControllerTouch.Init(this.s_hero, this.s_container);
        }
        else
        {
            Main.s_stage.enableMouseOver(5);
            ControllerKeyboard.Init(this.s_hero);
        }
    },


    UpdateCanvasSize: function(width, height)
    {
        if (width > height)
        {
            var h = Math.min(Main.HEIGHT_MAX, height / Main.SCALE);
            var scale = (h - Main.HEIGHT_MIN) / (Main.HEIGHT_MAX - Main.HEIGHT_MIN);

            var pos = [
                [80, 200],
                [190, 350],
                [300, 500]
            ];
            //update benches
            for (var i = 0; i < 3; i++)
            {
                var b = this.s_benches[i];
                b.y = pos[i][0] + scale * (pos[i][1] - pos[i][0]);
            }

            //
            this.s_container.scaleX = this.s_container.scaleY = Math.max(Main.SCALE, height / 640);

            //
            this.s_hero.updateSpots(this.s_benches);

            //
            Hud.UpdateCanvasSize(width, height);

            //
            if (this.s_help)
            {
                this.s_help.UpdateCanvasSize(width, height);
            }
        }
    }
};


function GameUpdate(e)
{
    ScreenGame.Update(e);
};