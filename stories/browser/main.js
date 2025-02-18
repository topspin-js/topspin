import stories from './registered-stories';

const tabsContainerId = 'tabs';
const storyHeadingId = 'storyHeading';
const storyDescriptionId = 'storyDescription';
const storyFormContainerId  = 'storyForm';
const storyFormDataInputId = 'storyFormData';
const storyControlsContainerId = 'storyControls';


let activeTab; // for keeping track of active tab


function TabButtons({activeTab}) {
    const [activeTab_, setActive] = window.React.useState(activeTab);

    const buttons = [];

    for (let tab in stories) {
        if (!stories.hasOwnProperty(tab))
            continue;

        const story = stories[tab];

        const btn = window.React.createElement(
            'button',
            {
                'className': tab === activeTab_ ? 'tab-btn active' : 'tab-btn',
                'key': tab,
                'onClick': function(e) {
                    setActive(tab);
                    renderTabStory(tab);
                }
            },
            story.name,
        );

        buttons.push(btn);
    }
    return buttons;
}


function createTabButtons(activeTab) {
    const tabsRoot = window.ReactDOM.createRoot(document.getElementById(tabsContainerId));
    tabsRoot.render(window.React.createElement(TabButtons, {'activeTab': activeTab}, null));
}


function renderTabStory(tab) {
    if (activeTab) {
        const activeStory = stories[activeTab];
        activeStory.unmount();
    }

    const story = stories[tab];
    document.getElementById(storyDescriptionId).textContent = story.description;
    story.render(storyFormContainerId, storyFormDataInputId, storyControlsContainerId);
    activeTab = tab;
}


export default function init() {
    const activeTab = Object.keys(stories)[0];
    createTabButtons(activeTab);
    renderTabStory(activeTab);
}
