const { waitFor, getOwnerInstance } = require('ac/util');
const { sleep } = require('ac/util');

module.exports = async function injectAutocomplete () {
  const _this = this;

  const plugins = [ ...aethcord.plugins.keys() ];
  while (!plugins.every(plugin =>
    aethcord.plugins.get(plugin).ready
  )) {
    await sleep(1);
  }

  const customCommands = [ ...this.commands.values() ]
    .map(command => ({
      command: command.name,
      description: command.description
    }));

  const inject = (inst) =>
    inst.props.autocompleteOptions.AETHCORD_CUSTOM_COMMANDS = {
      getText: (index, { commands }) => this.prefix + commands[index].command,
      matches: (_, content) => content && content[0] === this.prefix,
      queryResults: (content) => ({
        commands: customCommands.filter(c => c.command.startsWith(content))
      }),
      renderResults: (...args) => {
        const renderedResults = inst.props.autocompleteOptions.COMMAND.renderResults(...args);
        if (!renderedResults) {
          return;
        }

        let [ header, commands ] = renderedResults;

        header.type = class PatchedHeaderType extends header.type {
          renderContent (...args) {
            const rendered = super.renderContent(...args);

            if (
              Array.isArray(rendered.props.children) &&
              rendered.props.children[1]
            ) {
              const commandPreviewChildren = rendered.props.children[1].props.children;
              if (commandPreviewChildren[0].startsWith('/')) {
                commandPreviewChildren[0] = commandPreviewChildren[0].replace('/', _this.prefix);
              }
            }
    
            return rendered;
          }
        };

        for (const command of commands) {
          command.type = class PatchedCommandType extends command.type {
            renderContent (...args) {
              const rendered = super.renderContent(...args);

              const children = rendered.props.children;
              if (children[0].props.name === 'Slash') {
                rendered.props.children.shift();
              }

              const commandName = children[0].props;
              if (!commandName.children.startsWith(_this.prefix)) {
                commandName.children = _this.prefix + commandName.children;
              }

              return rendered;
            }
          }
        }

        return [ header, commands ];
      }
    };

  await waitFor('.channelTextArea-rNsIhG');

  const getInstance = () => getOwnerInstance(document.querySelector('.channelTextArea-rNsIhG'));
  const instance = getInstance();
  const instancePrototype = Object.getPrototypeOf(instance);

  instancePrototype.componentDidMount = (_componentDidMount => function (...args) {
    inject(getInstance());
    return _componentDidMount.call(this, ...args);;
  })(instancePrototype.componentDidMount);

  inject(instance);
};