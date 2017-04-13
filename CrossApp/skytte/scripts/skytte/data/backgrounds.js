define('skytte.data.backgrounds', ['skytte.entities.background'], function(BackgroundEntity) {

    var RED_MUSHROOM = {
        'particle': {'sprite': 'spores 0,0'},
        'sprites': ['mushrooms 0,0', 'mushrooms 1,0', 'mushrooms 2,0', 'mushrooms 3,0'],
    };
    var GREEN_MUSHROOM = {
        'particle': {'sprite': 'spores 0,1'},
        'sprites': ['mushrooms 0,1', 'mushrooms 1,1', 'mushrooms 2,1', 'mushrooms 3,1'],
    };

    var WHITE_FOG = {'sprite': 'fog 0,0'};
    var RED_FOG = {'sprite': 'fog 0,1'};

    var CRUST = {
        'layer6': {'spriteList': 'crustLayer6', 'speed': 20, 'align': BackgroundEntity.ALIGN_TOP},
        'layer5': {'spriteList': 'crustLayer5', 'speed': 30, 'align': BackgroundEntity.ALIGN_TOP, 'chance': .75},
        'layer4': {'spriteList': 'crustLayer4', 'speed': 40, 'align': BackgroundEntity.ALIGN_BOTTOM},
        'layer3': {'spriteList': 'crustLayer3', 'speed': 80, 'align': BackgroundEntity.ALIGN_TOP},
        'layer2': {'spriteList': 'crustLayer2', 'speed': 160, 'align': BackgroundEntity.ALIGN_BOTTOM},
        'layer1': {'spriteList': 'layer1', 'speed': 320, 'align': BackgroundEntity.ALIGN_BOTTOM, 'chance': .2},
        'mushroom': RED_MUSHROOM,
        'fog': WHITE_FOG
    };
    var MANTLE = {
        'layer6': {'spriteList': 'mantleLayer6', 'speed': 20, 'align': BackgroundEntity.ALIGN_TOP},
        'layer5': {'spriteList': 'mantleLayer5', 'speed': 30, 'align': BackgroundEntity.ALIGN_TOP},
        'layer4': {'spriteList': 'mantleLayer4', 'speed': 40, 'align': BackgroundEntity.ALIGN_BOTTOM},
        'layer3': {'spriteList': 'mantleLayer3', 'speed': 80, 'align': BackgroundEntity.ALIGN_TOP},
        'layer2': {'spriteList': 'mantleLayer2', 'speed': 160, 'align': BackgroundEntity.ALIGN_BOTTOM},
        'layer1': {'spriteList': 'layer1', 'speed': 320, 'align': BackgroundEntity.ALIGN_BOTTOM, 'chance': .2},
        'mushroom': GREEN_MUSHROOM
    };
    var CORE = {
        'layer6': {'spriteList': 'coreLayer6', 'speed': 20, 'align': BackgroundEntity.ALIGN_TOP},
        'layer5': {'spriteList': 'coreLayer5', 'speed': 30, 'align': BackgroundEntity.ALIGN_TOP},
        'layer4': {'spriteList': 'coreLayer4', 'speed': 40, 'align': BackgroundEntity.ALIGN_BOTTOM},
        'layer3': {'spriteList': 'coreLayer3', 'speed': 80, 'align': BackgroundEntity.ALIGN_TOP},
        'layer2': {'spriteList': 'coreLayer2', 'speed': 160, 'align': BackgroundEntity.ALIGN_BOTTOM},
        'layer1': {'spriteList': 'layer1', 'speed': 320, 'align': BackgroundEntity.ALIGN_BOTTOM, 'chance': .2},
        'fog': RED_FOG
    };

    return {
        'CRUST': CRUST,
        'MANTLE': MANTLE,
        'CORE': CORE,
        'RED_MUSHROOM': RED_MUSHROOM,
        'GREEN_MUSHROOM': GREEN_MUSHROOM,
        'WHITE_FOG': WHITE_FOG,
    };
});
