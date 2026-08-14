pipeline {
  agent any

  options {
    timestamps()
    skipDefaultCheckout(false)
  }

  stages {
    stage('Test Backend') {
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

    stage('Test & Build Frontend') {
      steps {
        dir('frontend') {
          bat 'npm ci'
          bat 'npm run lint'
          bat 'npm run typecheck'
          bat 'npm run test -- --passWithNoTests'
          bat 'npm run build'
        }
      }
    }

    stage('Build & Push Docker') {
      steps {
        bat 'docker build -t airbnb-clone-backend:latest backend'
        bat 'docker build -t airbnb-clone-frontend:latest frontend'
        // Add docker push commands here if using an external registry
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        bat 'kubectl apply -k k8s/'
      }
    }
  }
}
