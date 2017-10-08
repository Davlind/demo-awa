import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
declare var ReactLoginMS: any;
// import * as ReactLoginMS from 'react-ms-login';

export default class Home extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div>
            <h1>Hello, world!</h1>
            <p>Welcome to your new single-page application, built with:</p>
            {/* <ReactLoginMS
                clientId="a157e2ad-7d43-4478-9051-541fd1b2023f" // required: 'application id/client id' obtained from https://apps.dev.microsoft.com for your app
                redirectUri="http://localhost:9999/authComplete.html" // required: redirectUri registered in https://apps.dev.microsoft.com for your app
                scopes={["user.read"]} //optional: defaults to "user.read" full list is present https://developer.microsoft.com/en-us/graph/docs/concepts/permissions_reference
                responseType="token" //optional: valid values are "token" for `Implicite OAuth flow` and "code" for `Authorization Code flow` defaults to "token"
                cssClass="some-css-class" // optional: space separated class names which are applied on the html Button element
                btnContent={ButtonContent} // optional: can be string or a valid react component which can be rendered inside html Button element
                handleLogin={(data) => console.log(data)}// required: callback to receive token/code after successful login
            /> */}
            <ul>
                <li><a href='https://get.asp.net/'>ASP.NET Core</a> and <a href='https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx'>C#</a> for cross-platform server-side code</li>
                <li><a href='https://facebook.github.io/react/'>React</a>, <a href='http://redux.js.org'>Redux</a>, and <a href='http://www.typescriptlang.org/'>TypeScript</a> for client-side code</li>
                <li><a href='https://webpack.github.io/'>Webpack</a> for building and bundling client-side resources</li>
                <li><a href='http://getbootstrap.com/'>Bootstrap</a> for layout and styling</li>
            </ul>
            <p>To help you get started, we've also set up:</p>
            <ul>
                <li><strong>Client-side navigation</strong>. For example, click <em>Counter</em> then <em>Back</em> to return here.</li>
                <li><strong>Webpack dev middleware</strong>. In development mode, there's no need to run the <code>webpack</code> build tool. Your client-side resources are dynamically built on demand. Updates are available as soon as you modify any file.</li>
                <li><strong>Hot module replacement</strong>. In development mode, you don't even need to reload the page after making most changes. Within seconds of saving changes to files, rebuilt React components will be injected directly into your running application, preserving its live state.</li>
                <li><strong>Efficient production builds</strong>. In production mode, development-time features are disabled, and the <code>webpack</code> build tool produces minified static CSS and JavaScript files.</li>
                <li><strong>Server-side prerendering</strong>. To optimize startup time, your React application is first rendered on the server. The initial HTML and state is then transferred to the browser, where client-side code picks up where the server left off.</li>
            </ul>
        </div>;
    }

    // public componentDidMount() {
    //     this.startPolling();
    // }

    // public componentWillUnmount() {
    //     if (this._timer) {
    //         clearInterval(this._timer);
    //         this._timer = null;
    //       }
    // }

    // public startPolling() {
    //     var self = this;
    //     setTimeout(function() {
    //       if (!self.isMounted()) { return; } // abandon 
    //       self.poll(); // do it once and then start it up ...
    //       self._timer = setInterval(self.poll.bind(self), 15000);
    //     }, 1000);
    // }
}
