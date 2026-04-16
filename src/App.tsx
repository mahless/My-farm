/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FarmProvider } from './context/FarmContext';
import { Dashboard } from './components/Dashboard';

export default function App() {
  return (
    <FarmProvider>
      <Dashboard />
    </FarmProvider>
  );
}
