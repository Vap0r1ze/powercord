const { React, i18n: { Messages } } = require('powercord/webpack');
const { open: openModal } = require('powercord/modal');
const { Clickable, Tooltip, Icon, Icons: { Chemistry } } = require('powercord/components');

const LicenseModal = require('../../../License');
const licenses = require('../../../../licenses');

// @todo: merge with Product/
module.exports = React.memo(
  ({ author, version, description, license }) =>
    <div className='powercord-plugin-container'>
      <div className='author'>
        <Tooltip text={Messages.APPLICATION_STORE_DETAILS_DEVELOPER} position='top'>
          <Icon name='Person'/>
        </Tooltip>
        <span>{author}</span>
      </div>
      <div className='version'>
        <Tooltip text={Messages.POWERCORD_PLUGINS_VERSION} position='top'>
          <Icon name='StoreTag'/>
        </Tooltip>
        <span>v{version}</span>
        {version.startsWith('0') &&
        <Tooltip text={Messages.BETA} position='top'>
          <Chemistry/>
        </Tooltip>}
      </div>
      <div className='license'>
        <Tooltip text={Messages.POWERCORD_PLUGINS_LICENSE} position='top'>
          <Icon name='Scale'/>
        </Tooltip>
        <span>{license}</span>
        {licenses[license] &&
        <Clickable onClick={() => openModal(() => <LicenseModal spdx={license} license={licenses[license]}/>)}>
          <Tooltip text={Messages.LEARN_MORE} position='top'>
            <Icon name='Info'/>
          </Tooltip>
        </Clickable>}
      </div>
      <div className='description'>
        <Tooltip text={Messages.DESCRIPTION} position='top'>
          <Icon name='Receipt'/>
        </Tooltip>
        <span>{description}</span>
      </div>
    </div>
);
