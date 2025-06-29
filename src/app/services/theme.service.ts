import { Injectable } from "@angular/core"

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private _isDarkMode = false

  get isDarkMode(): boolean {
    return this._isDarkMode
  }

  constructor() {
    this.initTheme()
  }

  initTheme(): void {
    const savedTheme = localStorage.getItem("serenacita-theme")
    if (savedTheme) {
      this._isDarkMode = savedTheme === "dark"
    } else {
      this._isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    this.applyTheme()
  }

  toggleTheme(): void {
    this._isDarkMode = !this._isDarkMode
    this.applyTheme()
    localStorage.setItem("serenacita-theme", this._isDarkMode ? "dark" : "light")
  }

  setTheme(isDark: boolean): void {
    this._isDarkMode = isDark
    this.applyTheme()
    localStorage.setItem("serenacita-theme", this._isDarkMode ? "dark" : "light")
  }

  private applyTheme(): void {
    if (this._isDarkMode) {
      document.documentElement.setAttribute("data-bs-theme", "dark")
      document.body.classList.add("bg-dark", "text-light")
    } else {
      document.documentElement.setAttribute("data-bs-theme", "light")
      document.body.classList.remove("bg-dark", "text-light")
    }
  }
}
