from flask import Flask, render_template, jsonify
import os
import socket
import json

app = Flask(__name__)

APP_NAME = "DevOps Trainer"
APP_VERSION = "1.0.0"


def load_questions():
    with open("data/questions.json", "r", encoding="utf-8") as file:
        return json.load(file)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/categories")
def categories():
    data = load_questions()
    return jsonify({
        key: {
            "name": val["name"],
            "subcategories": [[k, v] for k, v in val["subcategories"].items()]
        }
        for key, val in data.items()
    })


@app.route("/api/questions/<category>/<subcategory>")
def questions(category, subcategory):
    data = load_questions()

    if category not in data:
        return jsonify({"error": "Category not found"}), 404

    subcategories = data[category]["subcategories"]

    if subcategory not in subcategories:
        return jsonify({"error": "Subcategory not found"}), 404

    return jsonify(subcategories[subcategory]["questions"])


@app.route("/health")
def health():
    return {"status": "healthy"}


@app.route("/info")
def info():
    return {
        "app": APP_NAME,
        "version": APP_VERSION,
        "environment": os.getenv("APP_ENV", "development"),
        "hostname": socket.gethostname()
    }


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
