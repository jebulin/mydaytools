import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import AppRoutes from './AppRoutes';
import { ThemeProvider } from './contexts/ThemeContext';

export function render(url: string) {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </StaticRouter>
    </React.StrictMode>
  );
}
