from sklearn.base import BaseEstimator, TransformerMixin
import nltk
from nltk import word_tokenize
from nltk.corpus import stopwords
from langdetect import detect
import unicodedata
import re
from num2words import num2words
from nltk.stem.snowball import SnowballStemmer
import spacy
from sklearn.pipeline import make_pipeline

# Cargar Spacy NLP model
nlp = spacy.load('es_core_news_md')

# Transformador para filtrado de idioma
class LanguageFilter(BaseEstimator, TransformerMixin):
    def __init__(self, language='es'):
        self.language = language
    
    def fit(self, X, y=None):
        return self

    def transform(self, X, y=None):
        return X[X.apply(lambda text: detect(text) == self.language)]

# Transformador para eliminación de duplicados
class DropDuplicates(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass
    
    def fit(self, X, y=None):
        return self
    
    def transform(self, X, y=None):
        return X.drop_duplicates()

# Transformador para eliminación de valores nulos
class DropNullValues(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass
    
    def fit(self, X, y=None):
        return self
    
    def transform(self, X, y=None):
        return X.dropna()

# Transformador para preprocesamiento de texto
class TextPreprocessor(BaseEstimator, TransformerMixin):
    def __init__(self, stopwords=None):
        self.stopwords = stopwords if stopwords else set(stopwords.words('spanish'))
    
    def fit(self, X, y=None):
        return self
    
    def transform(self, X, y=None):
        return X.apply(self.preprocess_text)
    
    def preprocess_text(self, text):
        words = word_tokenize(text)
        words = [word.lower() for word in words]
        words = [re.sub(r'[^\w\s]', '', word) for word in words if re.sub(r'[^\w\s]', '', word) != '']
        words = [unicodedata.normalize('NFKD', word).encode('ascii', 'ignore').decode('utf-8', 'ignore') for word in words]
        words = [num2words(word, lang='es') if word.isdigit() else word for word in words]
        words = [word for word in words if word not in self.stopwords]
        return ' '.join(words)

# Transformador para stemming y lematización
class StemLemmatize(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.stemmer = SnowballStemmer("spanish")
    
    def fit(self, X, y=None):
        return self

    def transform(self, X, y=None):
        print(X)
        print()
        return X.apply(self.stem_and_lemmatize)
    
    def stem_and_lemmatize(self, text):
        stems = [self.stemmer.stem(word) for word in word_tokenize(text)]
        doc = nlp(" ".join(stems))
        lemmas = [token.lemma_ for token in doc]
        return ' '.join(stems + lemmas)
