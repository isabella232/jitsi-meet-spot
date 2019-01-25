const constants = require('../constants');
const MeetingInput = require('./meeting-input');
const PageObject = require('./page-object');

const CALENDAR_VIEW = '[data-qa-id=home-view]';
const JOIN_CODE_INFO = '[data-qa-id=join-info]';
const JOIN_CODE = '[data-qa-id=join-code]';
const REMOTE_CONTROL_LINK = '[data-qa-id=remote-control-link]';

/**
 * A page object for interacting with the calendar view of Spot.
 */
class CalendarPage extends PageObject {
    /**
     * Initializes a new {@code CalendarPage} instance.
     *
     * @inheritdoc
     */
    constructor(driver) {
        super(driver);

        this.meetingInput = new MeetingInput(this.driver);
        this.rootSelector = CALENDAR_VIEW;
    }

    /**
     * Scrapes the join code necessary for a remote control to connect to Spot.
     *
     * @returns {string}
     */
    getJoinCode() {
        this.driver.waitForVisible(
            JOIN_CODE_INFO,
            constants.VISIBILITY_WAIT
        );

        return this.driver.getText(JOIN_CODE);
    }

    /**
     * Opens the remote control window. This method uses a development feature
     * of opening the remote control in the same browser instance as Spot, but
     * in a popup window.
     *
     * @returns {string} The tabId of the newly opened window to display remote
     * control.
     */
    openRemoteControl() {
        this.driver.waitForVisible(
            REMOTE_CONTROL_LINK,
            constants.VISIBILITY_WAIT
        );

        const tabsIdsBeforeClick = this.driver.getTabIds();

        this.driver.click(REMOTE_CONTROL_LINK);
        this.driver.waitUntil(
            () => this._getNewTabIds(tabsIdsBeforeClick).length === 1,
            constants.VISIBILITY_WAIT,
            'Failed to detect a newly opened tab'
        );

        return this._getNewTabIds(tabsIdsBeforeClick)[0];
    }

    /**
     * Proceeds directly to the calendar view of Spot.
     *
     * @returns {void}
     */
    visit() {
        this.driver.url(constants.SPOT_URL);
        this.waitForVisible();
    }

    /**
     * Compares the currently opened tab ids with an array of tab ids and
     * returns the difference.
     *
     * @param {Array<string>} previousTabIds - The old tab ids to compare
     * against to calculate which of the current tabs are new.
     * @private
     * @returns {Array<string>}
     */
    _getNewTabIds(previousTabIds) {
        const currentTabIds = this.driver.getTabIds();

        return currentTabIds.filter(id => !previousTabIds.includes(id));
    }
}

module.exports = CalendarPage;
