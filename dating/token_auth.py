from channels.auth import AuthMiddlewareStack
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from http.cookies import SimpleCookie


class TokenAuthMiddleware:
    """
    Token authorization middleware for Django Channels 4
    """

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        headers = dict(scope["headers"])

        # Extracting cookies from the headers
        cookies = headers.get(b"cookie", b"").decode()
        cookie = SimpleCookie()
        cookie.load(cookies)

        # Extract the token from the cookies
        token_key = (
            cookie.get("Authorization").value if "Authorization" in cookie else None
        )

        if token_key:
            scope["user"] = await self.get_user(token_key)
        else:
            scope["user"] = AnonymousUser()

        return await self.inner(scope, receive, send)

    @database_sync_to_async
    def get_user(self, token_key):
        try:
            return Token.objects.get(key=token_key).user
        except Token.DoesNotExist:
            return AnonymousUser()


TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))
