import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/router/app_router.dart';
import 'core/design_system/app_theme.dart';
import 'core/services/user_session_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await UserSessionService().initSession();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF0A0A0F),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );
  runApp(
    const ProviderScope(
      child: AuraLiveApp(),
    ),
  );
}

class AuraLiveApp extends ConsumerWidget {
  const AuraLiveApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: 'Auralive',
      debugShowCheckedModeBanner: false,
      theme: AuraTheme.dark(),
      routerConfig: router,
    );
  }
}
