import base64
from django.http import HttpResponse, JsonResponse
import joblib
from matplotlib import pyplot as plt
import pandas as pd
from joblib import load
from langdetect import detect
from requests import request
from sklearn.metrics import ConfusionMatrixDisplay, f1_score, precision_score, recall_score
from sklearn.model_selection import train_test_split
from .transformaciones import DropDuplicates, DropNullValues, LanguageFilter, TextPreprocessor, StemLemmatize
import io
import os
import json
from .models import Usuario
from Api import settings
from django.core import serializers
import datetime

def login(req):
        correo_a= req["correo"]
        password= req["password"]
        print(correo_a)
        try:
            usuario = Usuario.objects.get(correo=correo_a)
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'Correo no encontrado'}, status=404)

        if password != usuario.password:
            return JsonResponse({'error': 'Contrasenha incorrecta'}, status=401)

        # Si el correo y la contraseña son válidos, genera un token JWT


        response_data = {
            'Estatus':'Logeado'
        }

        return JsonResponse(response_data, status=200)
def register(ud):
     usuario_creado= Usuario(nombre=ud["nombre"],correo=ud["correo"],password=ud["password"], reviews = "{}", 
                             modelos = ud["modelos"])
     usuario_creado.save()
     return JsonResponse(serializers.serialize('json',[usuario_creado]), status=200,safe=False)
def prediccionCsv(req):
    file = req.FILES['file']
    directorio_actual = os.path.dirname(__file__)
    ruta = os.path.join(directorio_actual, 'modelo_prediccion.joblib')
    pipeline = load(ruta) 
    # Leer el archivo CSV
    data = pd.read_csv(file, sep=',', encoding="ISO-8859-1")
    # Realizar predicciones
    data['Rating'] = pipeline.predict(data['Review'])
    # Calcular estadísticas
    stats = {
        'maximo': int(data['Rating'].max()),
        'minimo': int(data['Rating'].min()),
        'promedio': float(data['Rating'].mean()),
        'desviacion_estandar': float(data['Rating'].std()),
        'cantidad_de_registros': int(len(data))
    }
    # Crear gráfico de la distribución de los ratings
    plt.figure(figsize=(8, 6))
    plt.hist(data['Rating'], bins=10, color='skyblue', edgecolor='black')
    plt.title('Distribución de Ratings')
    plt.xlabel('Rating')
    plt.ylabel('Frecuencia')
    plt.grid(True)
    plt.tight_layout()
    # Guardar el gráfico en un buffer de Bytes
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    # Codificar el gráfico en base64
    graph_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    # Adjuntar los datos a un diccionario
    response_data = {
        'stats': stats,
        'graph': graph_base64,
        'csv_data': data.to_dict(orient='records')  # Convertir DataFrame a diccionario
    }
    # Crear la respuesta HTTP
    response = HttpResponse(content_type='application/json')
    response['Content-Disposition'] = 'attachment; filename="results.json"'
    # Convertir el diccionario a JSON y adjuntarlo a la respuesta
    response.write(json.dumps(response_data)) 
    return response
def prediccionTexto(req):
        data = req.body.decode('utf-8')
        data_json = json.loads(data)
        correo = data_json['correo']
        usuario = getUsuario(correo)
        directorio_actual = os.path.dirname(__file__)
        ruta = os.path.join(directorio_actual,'modelo_prediccion.joblib')
        pipeline = load(ruta)
        # Importante: json.loads(data) si el contenido es JSON
        reviews = data_json['reviews']
        reviews_list = reviews.split("|$|")
        df = pd.DataFrame(reviews_list, columns=['Reviews'])
        df['Rating']= pipeline.predict(df['Reviews'])
        reviews_ratings_dict = df.to_dict(orient='records')
        print(reviews_ratings_dict)
        reviews_usuario = json.loads(usuario.reviews)
        print(reviews_usuario)
        for review in reviews_ratings_dict:
              reviews_usuario[review['Reviews']]=  review['Rating']
        print(reviews_usuario)
        print(type(reviews_usuario))
        a = json.dumps(reviews_usuario)
        print(type(a))
        print(a)
        usuario.reviews = a
        usuario.save()
        # Devolver el diccionario como una respuesta JSON
        return JsonResponse({'status': 'success', 'data': reviews_ratings_dict})
        
def crearmodelo(req):
        file= req.FILES['file']
        datos =pd.read_csv(file, sep=',', encoding = "ISO-8859-1")
        directorio_actual = os.path.dirname(__file__)
        ruta = os.path.join(directorio_actual,'modelo_entrenamiento.joblib')
        pipeline = load(ruta)
        X_train, X_test, y_train, y_test = train_test_split(datos['Review'], datos['Class'], test_size=0.3, stratify=datos['Class'], random_state=1)
        pipeline.fit(X_train,y_train)
        model_buffer = io.BytesIO()
        joblib.dump(pipeline, model_buffer)
        model_buffer.seek(0)
        model_base64 = base64.b64encode(model_buffer.getvalue()).decode('utf-8')
        predictions = pipeline.predict(X_test)
        confusion_matrix_display = ConfusionMatrixDisplay.from_predictions(y_test, predictions)
        fig, ax = plt.subplots(figsize=(10, 10))
        confusion_matrix_display.plot(ax=ax) 
        # Guardar la imagen en un buffer en memoria, luego codificarla en base64
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        plt.close()
        image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        precision = precision_score(y_test, predictions, average='weighted')
        recall = recall_score(y_test, predictions, average='weighted')
        f1 = f1_score(y_test, predictions, average='weighted')
        result = {
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "confusion_matrix": image_base64,
        "modelo_base64": model_base64
        }
        
        return JsonResponse({"status": "success", "data": result})
def getUsuario(email):
        usuario = Usuario.objects.filter(correo = email).first()
        return usuario
def lastReviews(req):
        correo = req['correo']
        usuario = getUsuario(correo)
        reviews= usuario.reviews
        return JsonResponse({"status": "success", "data": reviews})
        
