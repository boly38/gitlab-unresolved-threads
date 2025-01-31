//~ commons - means compatible with 17_7 and 17_9
const createThreadsBadge = (element, color, resolved, resolvable) => {
    const li = $("<li/>").addClass("issuable-comments d-none d-sm-flex").prependTo(element);
    $("<span/>")
        .addClass("badge color-label")
        .css("background-color", color)
        .css("color", "#333333")
        .text(`${resolved}/${resolvable} threads resolved`)
        .prependTo(li);
}
const isCurrentPageAGitlabMRList = () => /^https:\/\/gitlab\.*.*\/merge_requests\/?(\?.*)?$/.test(window.location.href)

//~ commons end.

//~ before 17.7.x gitlab version
const gitlab_17_7_detect = () => {
    return ($(".merge-request").length > 0);
}

const gitlab_17_7_run = () => {
    $(".merge-request").each(function () {
        const anchor = $(this).find(".merge-request-title-text a")[0];
        const metaList = $(this).find(".issuable-meta ul, ul.controls")[0];

        $.ajax({
            url: `${anchor.href}/discussions.json`,
            success: function (result) {
                let resolvable = 0;
                let resolved = 0;
                result.forEach(item => {
                    if (item.resolvable) resolvable++;
                    if (item.resolved) resolved++;
                });

                if (resolvable > resolved) {
                    createThreadsBadge(metaList, "#ffd3d3", resolved, resolvable);
                } else if (resolved === resolvable && resolvable > 0) {
                    createThreadsBadge(metaList, "#8fc7a6", resolved, resolvable);
                }
            }
        });
    });
}
//~ before 17.7.x end.

//~ after 17.9.x gitlab version
const gitlab_17_9_latest_detect = () => {
    return ($(".issue").length > 0);
}
const gitlab_17_9_latest_main = () => {
    function run() {
        $(".issue").each(function () {
            const anchor = $(this).find(".issue-title a")[0];
            const metaList = $(this).find(".issuable-meta ul, ul.controls")[0];

            if (!anchor || !metaList) return;

            $.ajax({
                url: `${anchor.href}/discussions.json`,
                success: function (result) {
                    let resolvable = 0;
                    let resolved = 0;
                    result.forEach((item) => {
                        if (item.resolvable) resolvable++;
                        if (item.resolved) resolved++;
                    });

                    if (resolvable > resolved) {
                        createThreadsBadge(metaList, "#ffd3d3", resolved, resolvable);
                    } else if (resolved === resolvable && resolvable > 0) {
                        createThreadsBadge(metaList, "#8fc7a6", resolved, resolvable);
                    }
                },
            });
        });
    }

    try {
        if (typeof MutationObserver !== "undefined") {
            const targetNode = document.querySelector(".content-list");

            if (targetNode) {
                const observer = new MutationObserver(run);

                const config = {
                    childList: true, // Observe additions/removals of child nodes
                    attributes: false, // Observe attribute changes
                    subtree: false, // Observe changes in all descendants
                    characterData: false, // Observe text content changes
                };

                observer.observe(targetNode, config);

                console.log("MutationObserver is now watching .content-list");
            } else {
                throw new Error(".content-list element not found!");
            }
        } else {
            throw new Error("MutationObserver is not supported in this environment.");
        }
    } catch (error) {
        console.error("MutationObserver setup failed:", error.message);

        setTimeout(() => {
            run();
        }, 3000);
    }
}
//~ after 17.9.x end.


//~ main entry point
const extension_main = (debugMode = false) => {
    if (!isCurrentPageAGitlabMRList()) {
        return;// avoid processing for out-of-scope pages
    }
    if (gitlab_17_7_detect()) {
        debugMode && console.log("gitlab-unresolved-threads 17_7");
        gitlab_17_7_run()
        return;
    }

    if (gitlab_17_9_latest_detect()) {
        debugMode && console.log("gitlab-unresolved-threads 17_9");
        gitlab_17_9_latest_main();
        return;
    }

    console.warn("gitlab-unresolved-threads extension is not compatible with current gitlab version." +
        "If you're using a recent gitlab version, you can open a github issue.");

}

const debugMode = false;
extension_main(debugMode);
