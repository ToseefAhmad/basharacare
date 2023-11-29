function makeRoutesTarget(app) {
    const routeList = app.reactComponent('src/components/overrides/Routes/routes.js');
    const routes = [...require('@magento/venia-ui/lib/defaultRoutes.json'), ...require('./routes.json')];

    addRoutes(routeList, routes);
}

function addRoutes(routeList, routes) {
    const AuthRouteComponent = routeList.addImport(
        'import AuthRoute from "@magento/venia-ui/lib/components/Routes/authRoute"'
    );
    const EmptyLayoutComponent = routeList.addImport('import EmptyLayout from "@app/layouts/EmptyLayout"');
    const MainLayoutComponent = 'MainLayout';

    for (const route of routes) {
        const correctredPath =
            route.path.substring(0, 3) === '../'
                ? '@magento/venia-ui/lib/components/' + route.path.slice(3)
                : route.path;
        const AddedRoute = routeList.addReactLazyImport(correctredPath, route.name);
        const exact = route.exact ? 'exact ' : '';
        const path = JSON.stringify(route.pattern);
        const redirectTo = route.authed && route.redirectTo ? JSON.stringify(route.redirectTo) : null;
        const redirectToProp = redirectTo ? `redirectTo={${redirectTo}} ` : '';
        const direction = route.direction || 'default';
        const Component = route.authed ? AuthRouteComponent : 'Route';
        const LayoutComponent = route.layout === 'empty' ? EmptyLayoutComponent : MainLayoutComponent;

        routeList.prependJSX(
            'Switch',
            `<${Component} ${exact}${redirectToProp}path={${path}}><${LayoutComponent} direction="${direction}"><${AddedRoute}/></${LayoutComponent}></${Component}>`
        );

        routeList.insertAfterSource(
            'const availableRoutes = [];',
            'availableRoutes.push(' + JSON.stringify(route) + ');'
        );
    }
}

module.exports = makeRoutesTarget;
