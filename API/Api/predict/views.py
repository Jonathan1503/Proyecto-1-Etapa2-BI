import imp
from django.shortcuts import render
import json
from django.views.decorators.csrf import csrf_exempt
from .predicciones import prediccionCsv as pcsv
from .predicciones import prediccionTexto as ptxt
from .predicciones import crearmodelo as cm
from .predicciones import login as lg
from .predicciones import register as rg
from .predicciones import lastReviews as lr
# Create your views here.

@csrf_exempt
def prediccionCsv(request):
    return pcsv(request)
@csrf_exempt
def prediccionTxt(request):
    return ptxt(request)
@csrf_exempt
def entrenamiento(request):
    return cm(request)
@csrf_exempt
def login(request):
    return lg(json.loads(request.body))
@csrf_exempt
def register(request):
    return rg(json.loads(request.body))
@csrf_exempt
def lastReviews(request):
    return lr(json.loads(request.body))

