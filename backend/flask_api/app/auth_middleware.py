from functools import wraps
import jwt
from flask import request, abort
from flask import current_app
from .models import Users
from flask import jsonify

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # print(request.headers)
        if "Authorization" in request.headers:
            #  token = request.headers["Authorization"].split(" ")[1]
            # print(request.data)
            token = request.headers["Authorization"].split(" ")[0]


        if not token:
            return jsonify({
                "message": "Authentication Token is missing!",
                "data": None,
                "error": "Unauthorized"
            }), 401
        try:
            data=jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user=Users().get_by_id(data["user_id"])
            if current_user is None:
                return jsonify({
                "message": "Invalid Authentication token!",
                "data": None,
                "error": "Unauthorized"
            }), 401
        except Exception as e:
            return jsonify({
                "message": "Something went wrong",
                "data": None,
                "error": str(e)
            }), 500

        return f(current_user, *args, **kwargs)

    return decorated