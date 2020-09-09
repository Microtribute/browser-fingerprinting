# Browser Fingerprinting Demo

## Findings

### General Notes
- It does not seems to be a good idea to rely on the user agent as it is subject to frequent changes.

### Special Notes for the Brave browser
- Brave changes the fingerprints (audio & canvas), and the names of the plugins on every startup. [Fingerprinting randomization](https://brave.com/whats-brave-done-for-my-privacy-lately-episode3/)
- Brave is shipped with third-party cookies disabled by default, making it almost impossible to identify users using third-party cookies.
- It is impossible to detect the brave browser just by looking at the user agent string.
  * Brave - `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36`
  * Chrome - `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36`
  * Vivaldi - `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.84 Safari/537.36`
  * Opera - `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 OPR/70.0.3728.178`
  * Edge - `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.44`
  * Edge (Old) - `Mozilla/5.0 (Windows NT 10.0; Win64; x64; ServiceUI 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363`
  * Firefox - `Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0`


### Links
- [FingerprintJS Pro Demo](https://www.fingerprintjs.com/demo)
- [Audio Fingerprinting](https://audiofingerprint.openwpm.com)
