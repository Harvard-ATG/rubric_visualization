from django.http import JsonResponse
from functools import wraps
from canvas_oauth.oauth import get_oauth_token
from canvas_oauth.exceptions import MissingTokenError, CanvasOAuthError


def api_login_required(viewfunc):
    """
    Decorator that returns a 403 for unauthenticated API requests.
    """

    @wraps(viewfunc)
    def wrap(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({"message": "Authentication required"}, status=403)
        return viewfunc(request, *args, **kwargs)

    return wrap


def require_canvas_oauth_token(viewfunc):
    """
    Decorator that triggers oauth2 flow to obtain an auth token.

    Expects the user to be authenticated, because the token is 
    associated with that user. If the user does not have a token,
    they will be redirected to Canvas to authorize the app. The
    flow is handled by the canvas_oauth library.
    """

    @wraps(viewfunc)
    def wrap(request, *args, **kwargs):
        get_oauth_token(request)  # calling this method for its side-effect
        return viewfunc(request, *args, **kwargs)

    return wrap


def api_canvas_oauth_token_exception(viewfunc):
    """
    Decorator that wraps exceptions raised by get_oauth_token(), otherwise
    the exception will be handled by the middleware and trigger the oauth flow.
    """

    @wraps(viewfunc)
    def wrap(request, *args, **kwargs):
        try:
            return viewfunc(request, *args, **kwargs)
        except MissingTokenError:
            return JsonResponse({"message": "Missing oauth token"}, status=403)
        except CanvasOAuthError:
            return JsonResponse({"message": "Failed to obtain OAuth token"}, status=500)

    return wrap
