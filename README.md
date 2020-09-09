# Browser Fingerprinting Demo

## Findings

### General Notes
- It does not seems to be a good idea to rely on the user agent as it is subject to frequent changes.
- DuckDuckGo has a seemlingly awkwardly oddly reliable way to detect the browser. - *SUPER RELIABLE*
> Reportedly, Duckduckgo partnered with Brave and Vivaldi. As a result, these browsers whitelist https://duckduckgo.com and expose their exact app name (Brave and Vivaldi) when the duckduckgo website is open. Looking at [the source code of the Brave browser](https://github.com/brave/brave-core), Netflix (netflix.com) is also whitelisted.

#### User Agent Strings
It is important to know that browsers spit out different user agent strings when sending out HTTP requests versus when using `navigator.userAgent`. Relying on `navigator.userAgent` must be used IF you have no other choice. (Maybe combining `navigator.appVersion` could be useful) As a rule of thumbs, the browser name must be detected on the server side - Compare the following user agent strings. For each browser the first string is obtained by using `navigator.userAgent` API, whereas the second string is obtaind on the server side. The last line is obtained on DuckDuckGo.


##### Brave Desktop
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36`
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36`
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Brave Chrome/85.0.4183.83 Safari/537.36`
- `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Brave Chrome/85.0.4183.83 Safari/537.36`

##### Brave Mobile (Android)
- `Mozilla/5.0 (Linux; Android 11; sdk_gphone_x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Mobile Safari/537.36`
- `Mozilla/5.0 (Linux; Android 11; sdk_gphone_x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Brave Chrome/84.0.4147.125 Mobile Safari/537.36`

##### Google Chrome Chrome Desktop
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36`
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36`
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36`

##### Google Chrome Mobile (Android)
- `Mozilla/5.0 (Linux; Android 11; sdk_gphone_x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36`
- `Mozilla/5.0 (Linux; Android 11; sdk_gphone_x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36`

##### Firefox Desktop
- `Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0`
- `Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0`
- `Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0`

##### Vivaldi Desktop
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.84 Safari/537.36`
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.84 Safari/537.36`
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.84 Safari/537.36 Vivaldi/3.3.2022.39`

##### Vivaldi Mobile (Android)
- `Mozilla/5.0 (Linux; Android 11; sdk_gphone_x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Mobile Safari/537.36`
- `Mozilla/5.0 (Linux; Android 11; sdk_gphone_x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Mobile Safari/537.36 Vivaldi/3.2.1996.30`

##### Opera
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 OPR/70.0.3728.178`
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 OPR/70.0.3728.178`
- `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 OPR/70.0.3728.178`

##### Edge
- `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.44`
- `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.44`
- `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.44`

##### Edge (Old)

On the startup page (possibly a slightly different browser that is embedded):
- `Mozilla/5.0 (Windows NT 10.0; Win64; x64; ServiceUI 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363`

On normal web pages:
- `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363`
- `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363`

##### Tor Mobile (Android)
- `Mozilla/5.0 (Android 8.1; Mobile; rv:68.0) Gecko/20100101 Firefox/68.0`
- `Mozilla/5.0 (Android 6.0; Mobile; rv:68.0) Gecko/20100101 Firefox/68.0`
- `Mozilla/5.0 (Android 6.0; Mobile; rv:68.0) Gecko/20100101 Firefox/68.0`

##### DuckDuckGo Mobile (Android)
- `Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile DuckDuckGo/5 Safari/537.36`
- `Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile DuckDuckGo/5 Safari/537.36`
- `Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile DuckDuckGo/5 Safari/537.36`

### Special Notes for the Brave browser
- Brave changes the fingerprints (audio & canvas), and the names of the plugins on every startup. [Fingerprinting randomization](https://brave.com/whats-brave-done-for-my-privacy-lately-episode3/)
- Brave is shipped with third-party cookies disabled by default, making it almost impossible to identify users using third-party cookies.
- There is `navigator.brave` object we can use to detect the brave browser easily in pure JavaScript.

## DuckDuckGo Answer API
We can use the DuckDuckGo Answer API to identify the correct user agent string.

**Request URL**:`https://api.duckduckgo.com/?q=whats+my+user+agent&format=json`
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


### Links
- [FingerprintJS Pro Demo](https://www.fingerprintjs.com/demo)
- [Audio Fingerprinting](https://audiofingerprint.openwpm.com)
- [DuckDuckGo's What is my user agent?](https://duckduckgo.com/?q=user+agent&ia=answer)
