import { remote } from 'electron';
import { applyBindings } from 'knockout';
import App from './App';

const app = new App();
applyBindings(app);
