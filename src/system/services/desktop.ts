import { store } from '../../store'
import { changeBackground, changeLoggedUserName, clearError, login, loginFailed, selectUser, setAccent, User } from '../state/desktopSlice'

const DEF_BG_INDEX = 0

const LOCAL_KEY_ACCENT = 'os/desktop/accent'

const LOCAL_KEY_SYSTEM_USER = 'os/system/user'

const LOCAL_KEY_BG_URL = 'os/desktop/background/url'

const DesktopSvc = Object.freeze({
    changeBackground(url: string) {
        store.dispatch(changeBackground({ url }))
        localStorage.setItem(LOCAL_KEY_BG_URL, url)
    },
    changeLoggedUserName(newName: string, password: string) {
        const user = selectUser(store.getState())
        if (user && user.password === password) {
            store.dispatch(changeLoggedUserName({ newName, password }))
            localStorage.setItem(
                LOCAL_KEY_SYSTEM_USER,
                JSON.stringify({ ...user, name: newName }),
            )
        }
    },
    getAccent() {
        return localStorage.getItem(LOCAL_KEY_ACCENT) || 'blue'
    },
    getBackground() {
        return localStorage.getItem(LOCAL_KEY_BG_URL) || this.getPreinstalledBackgroundUrls()[DEF_BG_INDEX]
    },
    getPreinstalledBackgroundUrls() {
        return [
            'http://allhdwallpapers.com/wp-content/uploads/2015/07/River-2.jpg',
            'https://getwallpapers.com/wallpaper/full/c/1/6/1037268-large-snowy-desktop-backgrounds-1920x1200.jpg',
            'https://getwallpapers.com/wallpaper/full/7/9/2/165388.jpg',
            'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?cs=srgb&dl=pexels-simon-berger-1323550.jpg&fm=jpg',
            'https://wallup.net/wp-content/uploads/2017/03/15/70727-mountain-clouds-environment-blue-orange.jpg',
            'https://wallpapers.com/images/hd/mountain-and-lake-hd-desktop-2zzq9s6dv9woiw8n.jpg',
            'https://www.pixelstalk.net/wp-content/uploads/2016/11/Calm-HD-Wallpaper.jpg',
            // 'https://www.pixelstalk.net/wp-content/uploads/2016/05/Sky-hd-backgrounds-desktop.jpg',
            // 'https://www.pixelstalk.net/wp-content/uploads/2016/03/Sunset-wallpapers-HD-download-desktop.jpg',
            'https://wallpapercave.com/wp/V1rT4MO.jpg',
            // 'https://www.pixelstalk.net/wp-content/uploads/2016/07/3D-Nature-Desktop-Wallpapers-widescreen.jpg',
            // 'https://getwallpapers.com/wallpaper/full/2/8/2/13570.jpg',
            // 'https://getwallpapers.com/wallpaper/full/2/8/c/674102.jpg',
            'https://free4kwallpapers.com/uploads/originals/2015/11/30/mac-os-x-fluid-colors-wallpaper.jpg',
            'https://i.pinimg.com/originals/16/8b/d7/168bd74ee4df740c45286609a24a7b0f.jpg',
            'https://www.pixelstalk.net/wp-content/uploads/2016/06/Images-Galaxy-Wallpaper-Tumblr.jpg',
        ]
    },
    login(username: string, password: string) {
        store.dispatch(clearError())
        try {
            const user = JSON.parse(localStorage.getItem(LOCAL_KEY_SYSTEM_USER + '/' + username) || '') as User
            if (user && user.password === password) {
                store.dispatch(login(user))
            } else {
                store.dispatch(loginFailed(new Error('Wrong credentials')))
            }
        } catch (error) {
            store.dispatch(loginFailed(new Error('Something went wrong: ' + error)))
        }
    },
    setAccent(color: string) {
        store.dispatch(setAccent({ color }))
        localStorage.setItem(LOCAL_KEY_ACCENT, color)
    }
})

export default DesktopSvc
