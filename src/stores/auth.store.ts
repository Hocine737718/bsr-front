import { defineStore } from 'pinia'

interface AuthState {
  accessToken: string | null
  user: any | null
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      user: null,
      accessToken: null
    } as AuthState
  },

  actions: {
    set({ accessToken, user }: AuthState) {
      this.accessToken = accessToken
      this.user = user
    },
    setUser(user: any) {
      this.user = user
    },
    isLoggedIn() {
      return this.user && this.accessToken ? true : false
    },
    logOut() {
      this.user = null
      this.accessToken = null

      location.replace('/auth/login')
    }
  },
  persist: true
})
