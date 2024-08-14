from app.app import create_app
import os

# create and run app
if __name__ == '__main__':
    app = create_app()

    app.secret_key = os.getenv('SECRET_KEY')
    app.run(debug=True)