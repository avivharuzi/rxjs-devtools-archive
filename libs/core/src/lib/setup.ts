import { create } from 'rxjs-spy';

import { RxJSDevToolsPlugin } from './plugin';
import { RxJSDevToolsPluginOptions } from './plugin-options';

export const setupRxJSDevTools = (
  options: Partial<RxJSDevToolsPluginOptions> = {}
) => {
  const spy = create();

  spy.plug(new RxJSDevToolsPlugin(spy, options));
};
