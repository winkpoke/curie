FROM openjdk:8-alpine

COPY target/uberjar/curie.jar /curie/app.jar

EXPOSE 3000

CMD ["java", "-jar", "/curie/app.jar"]
