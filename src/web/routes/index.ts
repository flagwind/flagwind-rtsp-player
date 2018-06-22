/*!
 * Authors:
 *      jason <jasonsoop@gmail.com>
 * 
 * Copyright (C) 2010-present Flagwind Inc. All rights reserved. 
 */

const routes =
[
    {
        path: "/",
        redirect: "/dashboard"
    },
    {
        name: "dashboard",
        path: "/dashboard",
        component: (resolve: any) => (<any>require)(["src/web/views/dashboard.vue"], resolve)
    }
];

export default routes;
