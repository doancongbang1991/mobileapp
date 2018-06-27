/**
 * Created by pawel on 16.05.2014.
 */
var Status =
{
    s_level: 0,
    s_bonus: 0,
    s_points: 0,
    s_lives: 3,
    s_customers: [],

    Reset: function()
    {
        this.s_level = 0;
        this.s_bonus = 0;
        this.s_points = 0;
        this.s_lives = 3;
        this.s_customers = [{amount: 0, points: 0}, {amount: 0, points: 0}, {amount: 0, points: 0}, {amount: 0, points: 0},
            {amount: 0, points: 0}];
    },


    ResetLevel: function()
    {
        this.s_customers = [{amount: 0, points: 0}, {amount: 0, points: 0}, {amount: 0, points: 0}, {amount: 0, points: 0},
            {amount: 0, points: 0}];
    }
};