/**
 * Port: the identity provider.
 *
 * Split in two because the two halves run in different places. Sign-in has to
 * happen in the browser — it is what establishes the session that the Supabase
 * client persists and refreshes — while creating and deleting accounts needs
 * privileges the browser must never hold.
 *
 * @typedef {Object} BrowserAuthGateway
 * @property {(email: string, password: string) => Promise<{ user: Object, session: Object, emailConfirmed: boolean }>} signIn
 * @property {() => Promise<void>} signOut
 * @property {() => Promise<{ user: Object | null, session: Object | null }>} getSession
 * @property {(handler: (event: string, session: Object | null) => void) => () => void} onAuthStateChange
 *
 * @typedef {Object} AdminAuthGateway
 * @property {(input: { email: string, password: string }) => Promise<{ userId: string }>} createAccount
 * @property {(userId: string) => Promise<void>} deleteAccount
 */

export {}
