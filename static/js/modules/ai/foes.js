define(
    [
        'modules/ai/characters/boss',
        'modules/ai/characters/meteor',
        'modules/ai/characters/explorers',
        'modules/ai/characters/raiders',
	'modules/ai/characters/ufos'
    ],
    function(boss, meteor, explorers, raiders,ufos) {
        /*
         * This is basically a proxy module for all the enemies in the
         * static/js/modules/ai/enemies/ lib
         */


        //
        // Return API
        return {
            Boss: boss.Boss,
            Explorer: explorers.Explorer,
            HeavyExplorer: explorers.HeavyExplorer,
            Meteor: meteor.Meteor,
	   // Ufo: ufos.Ufo,
            Raider: raiders.Raider,
            HeavyRaider: raiders.HeavyRaider
        };
    });
