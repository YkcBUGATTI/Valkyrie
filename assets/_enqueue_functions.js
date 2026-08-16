
// file-scope array that will collect deferred functions
var funqueue = [];

// Wrap a function with a fixed "this" and params.
// fn - reference to function
// context - what you want "this" to be when calling fn
// params - object of parameters to pass to fn
var wrap_function = function (fn, context, params) {
    return function () {
        fn.call(context, params);
    };
};

// Bootstrap all flux blocks that PHP a rendus dans la page.
// Chaque bloc de config est un <script type="application/json" id="flux-config-<hash>">...</script>
// On va lire ces configs, créer la fonction différée correspondante, et la mettre dans funqueue.
var init_flux_queue_from_dom = function () {
    // Récupère tous les blocs de config générés par Flux_data::print_view()
    var configNodes = document.querySelectorAll(
        'script[type="application/json"][id^="flux-config-"]'
    );

    configNodes.forEach(function (node) {
        var cfg;

        try {
            cfg = JSON.parse(node.textContent);
        } catch (e) {
            // JSON illisible -> on skip
            return;
        }

        // On s'attend à avoir des fonctions globales comme init_flux_post, init_flux_image, etc.
        var initFnName = 'init_flux_' + cfg.flux_type;
        var initFn = window[initFnName];

        // On ne push que si la fonction d'init correspondante existe
        if (typeof initFn === 'function') {
            var func = wrap_function(initFn, window, {
                posts_per_page: cfg.posts_per_page,
                query_args: cfg.query_args,
                hash: cfg.hash,
                load_more_is_activated: cfg.load_more_is_activated,
                type: cfg.type,
                total: cfg.total,
                prev: cfg.prev,
                next: cfg.next,
                show_total_page: cfg.show_total_page,
                number_page_to_show: cfg.number_page_to_show,
                unique_id_nonce: cfg.unique_id_nonce
            });

            funqueue.push(func);
        }
    });
};

// Quand la fenêtre est chargée :
// 1. on lit le DOM pour remplir funqueue
// 2. on exécute toutes les fonctions en file
window.onload = function () {
    // Étape 1 : alimenter funqueue à partir des blocs JSON
    init_flux_queue_from_dom();

    // Étape 2 : vider funqueue, exécuter chaque fonction
    while (funqueue.length > 0) {
        (funqueue.shift())();
    }
};
