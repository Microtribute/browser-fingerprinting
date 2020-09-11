# Browser Fingerprinting Demo

## General Notes
- It does not seems to be a good idea to rely on the user agent as it is subject to frequent changes.
- DuckDuckGo has a seemlingly awkwardly oddly reliable way to detect the browser. - *SUPER RELIABLE* -  Partnered with several browser makers - See special notes.

## User Agent Strings
There are 3 ways of obtaining the user agent string of a web browser.

- Using `navigator.userAgent` JavaScript API
- Inspecing the `User-Agent` header on the server side (Not reliable as it is no longer a forbidden header name according the [footnote](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name), thus, subject to manipulation by user)
- Using a third-party service like DuckDuckGo

> Depending on what browser you're using these 3 methods may produce 3 different values.

### Brave Desktop
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36`
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36`
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Brave Chrome/85.0.4183.83 Safari/537.36`
- `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Brave Chrome/85.0.4183.83 Safari/537.36`

### Brave Mobile (Android)
- `Mozilla/5.0 (Linux; Android 11; sdk_gphone_x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Mobile Safari/537.36`
- `Mozilla/5.0 (Linux; Android 11; sdk_gphone_x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Brave Chrome/84.0.4147.125 Mobile Safari/537.36`

### Google Chrome Chrome Desktop
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36`
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36`
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36`

### Google Chrome Mobile (Android)
- `Mozilla/5.0 (Linux; Android 11; sdk_gphone_x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36`
- `Mozilla/5.0 (Linux; Android 11; sdk_gphone_x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36`

### Firefox Desktop
- `Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0`
- `Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0`
- `Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0`

### Vivaldi Desktop
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.84 Safari/537.36`
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.84 Safari/537.36`
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.84 Safari/537.36 Vivaldi/3.3.2022.39`

### Vivaldi Mobile (Android)
- `Mozilla/5.0 (Linux; Android 11; sdk_gphone_x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Mobile Safari/537.36`
- `Mozilla/5.0 (Linux; Android 11; sdk_gphone_x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Mobile Safari/537.36 Vivaldi/3.2.1996.30`

### Opera
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 OPR/70.0.3728.178`
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 OPR/70.0.3728.178`
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 OPR/70.0.3728.178`

### Edge
- `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.44`
- `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.44`
- `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.44`

### Edge (Old)

On the startup page (possibly a slightly different browser that is embedded):
- `Mozilla/5.0 (Windows NT 10.0; Win64; x64; ServiceUI 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363`

On normal web pages:
- `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363`
- `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363`

### Tor Mobile (Android)
- `Mozilla/5.0 (Android 8.1; Mobile; rv:68.0) Gecko/20100101 Firefox/68.0`
- `Mozilla/5.0 (Android 6.0; Mobile; rv:68.0) Gecko/20100101 Firefox/68.0`
- `Mozilla/5.0 (Android 6.0; Mobile; rv:68.0) Gecko/20100101 Firefox/68.0`

### DuckDuckGo Mobile (Android)
- `Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile DuckDuckGo/5 Safari/537.36`
- `Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile DuckDuckGo/5 Safari/537.36`
- `Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile DuckDuckGo/5 Safari/537.36`

## Special Notes for Brave
- Brave changes the fingerprints (audio & canvas), and the names of the plugins on every startup.
- Brave is shipped with third-party cookies disabled by default, making it almost impossible to identify users using third-party cookies.
- There is `navigator.brave` object we can use to detect the brave browser easily in pure JavaScript.
- Brave has partnered with DuckDuckGo and Netfix, whitelisting their websites on exposing the correct user agent string. Look at the [source code](https://github.com/brave/brave-core/blob/master/common/shield_exceptions.cc).
```cc
/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "brave/common/shield_exceptions.h"

#include <algorithm>
#include <vector>

#include "extensions/common/url_pattern.h"
#include "url/gurl.h"

namespace brave {

bool IsUAWhitelisted(const GURL& gurl) {
  static std::vector<URLPattern> whitelist_patterns({
    URLPattern(URLPattern::SCHEME_ALL, "https://*.duckduckgo.com/*"),
    // For Widevine
    URLPattern(URLPattern::SCHEME_ALL, "https://*.netflix.com/*")
  });
  return std::any_of(whitelist_patterns.begin(), whitelist_patterns.end(),
      [&gurl](URLPattern pattern){
        return pattern.MatchesURL(gurl);
      });
}

}  // namespace brave
```

## Special Notes for Vivaldi
The following domains are whitelisted by Vivaldi. [Offical Vivaldi souce code download](https://vivaldi.com/source/)
```cc
// Location: vivaldi-source/base/vivaldi_user_agent_white_list.inc

// Copyright (c) 2019 Vivaldi Technologies AS. All rights reserved

// List of domains that receive the user agen header with the Vivaldi/version
// string.
//
// All strings must be in the low-case and all lines must end with a comma.
// Empty lines and C++ comments can be used freely here. The order is not
// important, but keep the list ordered alphabetically within a block.

// Vivaldi hosts
"vivaldi.com",
"vivaldi.net",

// This is so various test scripts will see Vivaldi in the user agent
"tests.viv.int",

// Partners with branding for Vivaldi
"duckduckgo.com",
"ecosia.com",
"ecosia.org",
"qwant.com",
"startpage.com",

// VB-64209: Videos on ted.com fail if we use the chrome user agent.
"ted.com",
```

## DuckDuckGo Answer API
We can use the DuckDuckGo Answer API to identify the correct user agent string.

**Request URL**:`https://api.duckduckgo.com/?q=what+is+my+user+agent%3F&format=json`

**Response Example:**
```json
{
   "Infobox":"",
   "Answer":"Your user agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.84 Safari/537.36 Vivaldi/3.3.2022.39",
   "AbstractSource":"",
   "AnswerType":"useragent",
   "Heading":"",
   "Image":"",
   "Results":[
      
   ],
   "DefinitionURL":"",
   "RelatedTopics":[
      
   ],
   "ImageIsLogo":"",
   "meta":null,
   "Abstract":"",
   "Redirect":"",
   "ImageHeight":"",
   "Type":"E",
   "AbstractText":"",
   "Entity":"",
   "DefinitionSource":"",
   "ImageWidth":"",
   "Definition":"",
   "AbstractURL":""
}
```

## Conclusion
Fingerprinting is NOT going to be a reliable way to identify users. Fingerprinting does not work on Brave and may produce exactly the same fingerprint ---- Maybe a joke otherwise... Should be considered as a last resort due to its accuracy...
Third-party cookies are way more reliabe if we do not count in privacy-concerned browsers including Brave and Tor that block third-party cookies by default. (The DuckDuckGo browser does not seem to block third-party cookies by default.)


## Links
- [FingerprintJS Pro Demo](https://www.fingerprintjs.com/demo)
- [Audio Fingerprinting](https://audiofingerprint.openwpm.com)
- [DuckDuckGo's What is my user agent?](https://duckduckgo.com/?q=user+agent&ia=answer)
- [Tor vs Brave](https://tor.stackexchange.com/questions/21244/tor-vs-brave-which-is-technically-more-effective-to-hinder-user-tracking-fin)
- [Fingerprinting Randomization in Brave](https://brave.com/whats-brave-done-for-my-privacy-lately-episode3/)
- [Fingerprinting Protections in Brave](https://github.com/brave/brave-browser/wiki/Fingerprinting-Protections)
- [DuckDuckGo Instant Answer API](https://duckduckgo.com/api)
