define(['underscore', 'gamejs', 'modules/globals', 'modules/ai/foes'], function(_, gamejs, globals, foes) {
    /*
     * Level.
     * it's aware of all the enemies in this level and it's in charge of
     * generating them
     */
    var Level = function(opts) {
        this.speed = 1;
        _.extend(this, opts);
    };

    Level.prototype.update = function(msDuration, world) {
        var enemy;

        while (world.enemies.sprites().length < this.maxEnemies) {
            enemy = this.pickEnemy();
            enemy = new enemy.type(this);
            enemy.setInitialPosition();
            world.enemies.add(enemy);
        }
    };

    Level.prototype.isOver = function (time) {
        return typeof this.duration !== 'undefined' && time > this.duration;
    };

    Level.prototype.pickEnemy = function() {
        var oldAcc, probAcc = 0;
        var select  = Math.random();
        return _.find(this.enemies, function(enemy) {
            oldAcc = probAcc;
            probAcc += enemy.prob;
            return (select >= oldAcc && select < probAcc);
        });
    };


    /*
     * BossLevel.
     * Especial level where the duration is defined by the boss life.
     */
    var BossLevel = function(opts) {
        BossLevel.superConstructor.apply(this, arguments);
        this.boss = null;
        this.bossLife = 0;
        this.init = 5000;
        this.maxEnemies = 3;
        this.enemies = [
            {type: foes.Meteor, prob: .5},
	    {type: foes.Explorer, prob: .5}

        ];
    };
    gamejs.utils.objects.extend(BossLevel, Level);

    BossLevel.prototype.update = function(msDuration, world) {
        this.init -= msDuration;
        if (this.init > 0) return;
        if (this.boss === null) {
            this.boss = new foes.Boss(this, world.player);
            this.boss.setInitialPosition();
            this.bossLife = this.boss.life;
            world.enemies.add(this.boss);
        }
        if (this.boss.life < this.bossLife * 3 / 4)
            // shoot more meteors
            this.maxEnemies = 4;
        if (this.boss.life < this.bossLife / 2)
            this.enemies = [
                {type: foes.Meteor, prob: .7},
                {type: foes.Explorer, prob: .3}
            ];
        if (this.boss.life < this.bossLife / 4)
            this.maxEnemies = 5;

        var enemy;
        while (world.enemies.sprites().length < this.maxEnemies) {
            enemy = this.pickEnemy();
            enemy = new enemy.type(this);
            enemy.setInitialPosition();
            world.enemies.add(enemy);
        }
    };

    BossLevel.prototype.isOver = function (time) {
        return this.boss !== null && (this.boss === undefined || this.boss.life <= 0);
    };


    /*
     * Module helper functions
     */
    var list = [];

    var init = function() {
        list.push(
            new Level({
                duration: 10000,
                maxEnemies: 2,
                enemies: [
                    {type: foes.Explorer, prob: .07}
		   //{type: foes.Ufo, prob: 1}

                ]
            }),
            new Level({
                duration: 45000,
                maxEnemies: 3,
                enemies: [
                    {type: foes.Meteor, prob: .04},
                    {type: foes.Explorer, prob: .06}
                ]
            }),
            new Level({
                duration: 60000,
                maxEnemies: 4,
                enemies: [
                    {type: foes.Explorer, prob: .05},
                    {type: foes.HeavyExplorer, prob: .05}
                ]
            }),
            new Level({
                duration: 75000,
                maxEnemies: 5,
                enemies: [
                    {type: foes.Meteor, prob: .02},
                    {type: foes.Explorer, prob: .05},
                    //{type: foes.HeavyExplorer, prob: .3},
		    //{type: foes.Ufo, prob: .3},
                    {type: foes.Raider, prob: .03}
                ]
            }),
            new Level({
                duration: 75000,
                maxEnemies: 6,
                enemies: [
                    //{type: foes.Meteor, prob: .2},
                    {type: foes.HeavyExplorer, prob: .05},
                    {type: foes.Raider, prob: .05},
                    {type: foes.HeavyRaider, prob: .05}
                ]
            }),
            new Level({
                duration: 80000,
                maxEnemies: 7,
                enemies: [
                    {type: foes.Meteor, prob: .02},
                    {type: foes.HeavyExplorer, prob: .05},
                    //{type: foes.Raider, prob: .3},
		    //{type: foes.Ufo, prob: .3},
                    {type: foes.HeavyRaider, prob: .03}
                ]
            }),
            new BossLevel()
        );
    };

    var get = function(i) {
        return list[i];
    };

    var push = function (level) {
        return list.push(level);
    };

    var shift = function () {
        return list.shift();
    };


    //
    // Return API
    return {
        init: init,
        get: get,
        push: push,
        shift: shift
    };
});
