import { Client } from '@logux/client'

import {
  SyncMapBuilder,
  SyncMapValues,
  SyncMapStore
} from '../define-sync-map/index.js'
import { MapBuilder } from '../define-map/index.js'
import { MapStore } from '../create-map/index.js'

interface PrepareForTest {
  <V extends SyncMapValues>(
    client: Client,
    Builder: SyncMapBuilder<V>,
    value: Omit<V, 'id'> & { id?: string }
  ): SyncMapStore<V>
  <V extends object>(
    client: Client,
    Builder: MapBuilder<V>,
    value: Omit<V, 'id'> & { id?: string }
  ): MapStore<V>
}

/**
 * Create and load stores to builder’s cache to use them in tests
 * or storybook.
 *
 * ```js
 * import { prepareForTest, cleanStores } from '@logux/state'
 * import { TestClient } from '@logux/client'
 *
 * import { User } from '../store'
 *
 * let client = new TestClient('10')
 *
 * beforeEach(() => {
 *   prepareForTest(client, User, { name: 'Test user 1' })
 *   prepareForTest(client, User, { name: 'Test user 2' })
 * })
 *
 * afterEach(() => {
 *   cleanStores(User)
 * })
 * ```
 *
 * @param client `TestClient` instance.
 * @param Builder Store builder.
 * @param value Store values.
 * @returns The mocked store.
 */
export const prepareForTest: PrepareForTest

/**
 * Disable loader for filter for this builder.
 *
 * ```js
 * import { emptyInTest, cleanStores } from '@logux/state'
 *
 * beforeEach(() => {
 *   prepareForTest(client, User, { name: 'Test user 1' })
 *   prepareForTest(client, User, { name: 'Test user 2' })
 * })
 *
 * afterEach(() => {
 *   cleanStores(User)
 * })
 * ```
 *
 * @param Builder Store builder.
 */
export function emptyInTest(Builder: SyncMapBuilder): void
