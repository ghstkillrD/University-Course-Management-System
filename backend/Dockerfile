FROM openjdk:17-jdk-slim

WORKDIR /app

# Install necessary tools
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

# Copy gradle configuration files
COPY gradle gradle
COPY gradlew .
COPY gradlew.bat .
COPY build.gradle .
COPY settings.gradle .

# Make gradlew executable and download gradle wrapper jar if missing
RUN chmod +x gradlew && \
    mkdir -p gradle/wrapper && \
    if [ ! -f "gradle/wrapper/gradle-wrapper.jar" ]; then \
        echo "Downloading gradle-wrapper.jar..." && \
        wget -q -O gradle/wrapper/gradle-wrapper.jar \
        "https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradle/wrapper/gradle-wrapper.jar"; \
    fi

# Download dependencies (this layer will be cached if dependencies don't change)
RUN ./gradlew build --no-daemon -x test || echo "Dependencies downloaded"

# Copy source code
COPY src src

# Build the application
RUN ./gradlew build --no-daemon

EXPOSE 8080

CMD ["java", "-jar", "build/libs/ucms-0.0.1-SNAPSHOT.jar"]