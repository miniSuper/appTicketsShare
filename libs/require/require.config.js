require.config({
    waitSeconds: 0,
    urlArgs: 'v=' + (new Date()).getTime(),
    paths: {
        "layer": "../libs/layer/layer",
        "jquery": '../libs/jquery/jquery.min',
        "css": "../libs/require/css/css.min",
        "vue": "../libs/vue/vue",
        "js-cookie": "../libs/js-cookie/js-cookie"
    },
    shim: {
        "layer": {
            "deps": ['jquery', 'css!../libs/layer/layer.css']
        },
        "jquery": {
            "deps": []
        },
        "vue": {
            "deps": []
        }
    }
});