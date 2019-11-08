FROM tensorflow/tensorflow:latest-py3

WORKDIR /app

COPY . /app

RUN pip install --trusted-host pypi.python.org -r requirements.txt

# WORKAROUND: python executable must have a shebang if executable 
# --> problems with different line endings on windows/linux
# fix is just removing executable-permission on file
# https://github.com/pallets/werkzeug/issues/1482
RUN chmod -x api.py

EXPOSE 5000

CMD ["python", "api.py"]