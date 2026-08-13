pipeline {
  agent any

  options {
    timestamps()
    skipDefaultCheckout(false)
  }

  stages {
    stage('Backend') {
      steps {
        dir('backend') {
          bat 'python -m pip install --upgrade pip'
          bat 'pip install -r requirements.txt'
          bat 'pip install ruff'
          bat 'ruff check app tests'
          bat 'python -m pytest'
        }
      }
    }

    stage('Frontend') {
      steps {
        dir('frontend') {
          bat 'npm ci'
          bat 'npm run lint'
          bat 'npm run typecheck'
          bat 'npm run build'
        }
      }
    }

    stage('Docker Build') {
      steps {
        bat 'docker build -t airpnb-clone-backend:ci backend'
        bat 'docker build -t airpnb-clone-frontend:ci frontend'
      }
    }
  }
}
