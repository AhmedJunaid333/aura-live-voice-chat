# ProGuard Rules for Aura Live Voice Room Release Build
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.agora.** { *; }
-keep class com.google.firebase.** { *; }
-dontwarn io.agora.**
-dontwarn com.google.firebase.**
