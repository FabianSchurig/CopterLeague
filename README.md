# CopterLeague

[![Code Climate](https://codeclimate.com/github/Bitfroest/CopterLeague/badges/gpa.svg)](https://codeclimate.com/github/Bitfroest/CopterLeague)
[![David DM](https://david-dm.org/Bitfroest/CopterLeague.svg)](https://david-dm.org/Bitfroest/CopterLeague)

CopterLeague is a web service written in [Node.js][nodejs]. This platform gives an overview of all FPV Multirotor events in Germany and administers events and participants. The organisators can publish their official or inofficial competitions with additional information. The pilots then can register for a race and afterall the results of each race are uploaded. So we are able to create an overall pilot ranking from Germany.

## API
### Authentication

The first thing to do is requesting a token from one of the auth APIs, e.g.
`/api/auth/login` for an email/password login. The returned token should
be cached by the client for subsequent requests. The token is valid until
its expiration date. Every request that requires authentication must add
a special header:

```
Authorization: Bearer <token>
```

`<token>` must be replaced with the authorization token.

By design this authorization method is secured against CSRF attacks since
foreign sites do not know the token and cannot send it in an HTTP header.
However, the method is attackable via XSS because the token information must be
saved in a permanent storage like `localStorage` that can be read by any
scripts that are loaded in the context of the web application. To protect against
such attacks the authentication API offers to set a special XSS cookie that
is checked whenever the authorization token is validated. The cookie value must be
signed and http-only.

[nodejs]: https://nodejs.org/en/
