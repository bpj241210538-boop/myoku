// settings.js - Global Settings Synchronization
// PENTING: Fail ini MESTI di-load SEBELUM Alpine.js di setiap page

// Global store untuk settings
document.addEventListener('alpine:init', () => {
    Alpine.store('prefs', {
        // State
        lang: localStorage.getItem('myoku_lang') || 'ms',
        isDark: localStorage.getItem('myoku_dark') === 'true' || 
                (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('myoku_dark')),
        fontSize: parseInt(localStorage.getItem('myoku_font')) || 16,

        // Methods untuk update
        setLang(value) {
            this.lang = value;
            localStorage.setItem('myoku_lang', value);
            // Broadcast event untuk通知 semua page
            window.dispatchEvent(new CustomEvent('prefs:lang', { detail: value }));
        },

        setDark(value) {
            this.isDark = value;
            localStorage.setItem('myoku_dark', value);
            this.applyTheme(value);
            window.dispatchEvent(new CustomEvent('prefs:dark', { detail: value }));
        },

        setFontSize(value) {
            this.fontSize = value;
            localStorage.setItem('myoku_font', value);
            document.documentElement.style.fontSize = value + 'px';
            window.dispatchEvent(new CustomEvent('prefs:font', { detail: value }));
        },

        // Apply theme ke document
        applyTheme(isDark) {
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        },

        // Init function - panggil masa page load
        init() {
            // Apply saved theme
            this.applyTheme(this.isDark);
            
            // Apply saved font size
            document.documentElement.style.fontSize = this.fontSize + 'px';
            
            console.log('Settings initialized:', {
                lang: this.lang,
                isDark: this.isDark,
                fontSize: this.fontSize
            });
        }
    });
});

// Function untuk sync dengan component Alpine
window.syncSettings = function(component) {
    // Update component dengan store value
    if (component && Alpine.store('prefs')) {
        const prefs = Alpine.store('prefs');
        component.lang = prefs.lang;
        component.isDark = prefs.isDark;
        component.currentFontSize = prefs.fontSize;
        
        // Apply theme
        if (prefs.isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        // Apply font
        document.documentElement.style.fontSize = prefs.fontSize + 'px';
    }
};

// Auto-execute bila page ready
document.addEventListener('DOMContentLoaded', () => {
    // Tunggu Alpine siap
    if (window.Alpine) {
        // Store akan auto init melalui alpine:init
    }
});