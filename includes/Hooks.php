<?php

namespace MediaWiki\Extension\DarkMode;

use IContextSource;
use MediaWiki\Hook\BeforePageDisplayHook;
use OutputPage;
use Skin;

class Hooks implements
    BeforePageDisplayHook
{

    /**
     * Handler for BeforePageDisplay hook.
     *
     * @param OutputPage $out
     * @param Skin $skin Skin being used.
     */
    public function onBeforePageDisplay($out, $skin): void
    {
        $out->addModules('ext.DarkMode.js');
        $out->addModules('ext.DarkMode.EmojiWrap.js');
        $out->addModuleStyles('ext.DarkMode.css');

        if ($this->isDarkModeActive($skin)) {
            // The class must be on the <html> element because the CSS filter creates a new stacking context.
            // If we use the <body> instead (OutputPage::addBodyClasses), any fixed-positioned content
            // will be hidden in accordance with the w3c spec: https://www.w3.org/TR/filter-effects-1/#FilterProperty
            // Fixed elements may still be hidden in Firefox due to https://bugzilla.mozilla.org/show_bug.cgi?id=1650522
            $out->addHtmlClasses('client-darkmode');
            $out->addMeta('color-scheme', 'dark');
        } else {
            $out->addHtmlClasses('client-lightmode');
            $out->addMeta('color-scheme', 'light');
        }
    }

    /**
     * Is the Dark Mode active?
     *
     * @param IContextSource $context
     * @return bool
     */
    private function isDarkModeActive(IContextSource $context): bool
    {
        $var = !isset($_GET['usedarkmode']) ? '' : $_GET['usedarkmode'];
        if ($var === '0' || $var === '1') {
            // On usedarkmode is set, overwrite the cookie.
            return (bool)$var;
        }
        $varCookie = !isset($_COOKIE['usedarkmode']) ? '' : $_COOKIE['usedarkmode'];
        if ($varCookie === '0' || $varCookie === '1') {
            // If usedarkmode not set, return cookie value.
            return (bool)$varCookie;
        }
        // Otherwise return false
        return false;
    }
}
