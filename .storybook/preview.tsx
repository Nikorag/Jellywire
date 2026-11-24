import type { Preview } from '@storybook/react-vite'
import '../src/styles/tokens.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    backgrounds: {
      default: 'jellywire-dark',
      values: [{ name: 'jellywire-dark', value: '#1f2225' }],
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },

  decorators: [
    (Story, context) => {
      const isFullscreen = context.parameters.layout === 'fullscreen'
      return (
        <div style={{ background: '#1f2225', minHeight: '100%', padding: isFullscreen ? 0 : 16 }}>
          <Story />
        </div>
      )
    },
  ],
};

export default preview;