# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests -B

# Stage 2: Run
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["sh", "-c", "if [ -n \"$DB_HOST\" ]; then export SPRING_DATASOURCE_URL=\"jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}\"; fi && java -jar app.jar"]
