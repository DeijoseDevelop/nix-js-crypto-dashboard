import { NixComponent, createErrorBoundary } from "@deijose/nix-js";
import { Dashboard } from "./components/Dashboard.js";
import { SystemError } from "./components/SystemError.js";

export class App extends NixComponent {
    onError(err) {
        console.error("Critical Application Error:", err);
    }

    render() {
        return createErrorBoundary(
            new Dashboard(),
            (error) => SystemError(error)
        );
    }
}