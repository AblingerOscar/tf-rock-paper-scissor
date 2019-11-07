FROM tensorflow/tensorflow:latest-py3-jupyter
MAINTAINER Oscar Ablinger (dev.ablinger@gmail.com)
CMD ["/start.sh"]

ADD start.sh /
RUN ["chmod", "+x", "/start.sh"]

RUN jupyter notebook --generate-config
RUN echo "c.NotebookApp.password='sha1:d1763fe2e655:0b9e8421edd9744441ed4f6c90daa6fae9d83b81'" >> /root/.jupyter/jupyter_notebook_config.py

RUN pip install imageio scikit-image keras

