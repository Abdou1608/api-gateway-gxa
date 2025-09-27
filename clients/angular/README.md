Angular integration (v15+ / v16+ / v17+ / v18+ / v19+ / v20+)

1) Copy `gateway-error.ts` into your Angular app, for example: `src/app/shared/errors/gateway-error.ts`.

2) Use it in a global HttpInterceptor:

// src/app/core/interceptors/error.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { normalizeAngularHttpError, inferSeverity, resolveI18nKeyFromError } from '../../shared/errors/gateway-error';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        const gerr = normalizeAngularHttpError(err);
        // Example: log and route to your notification service
        console.error('[API Error]', {
          type: gerr.type,
          code: gerr.code,
          requestId: gerr.requestId,
          status: gerr.httpStatus,
          isSoapFault: gerr.isSoapFault,
        });
        const severity = inferSeverity(gerr);
        const i18nKey = resolveI18nKeyFromError(gerr);
        // notifyService.show({ severity, messageKey: i18nKey, details: gerr.details });
        return throwError(() => gerr);
      })
    );
  }
}

3) Provide it in your app config/module.

Notes
- The gateway adds headers X-Error-Type, X-Error-Code, X-SOAP-FAULT and propagates X-Request-Id.
- The normalized error exposes: type, code, message, details, requestId, timestamp, httpStatus, headers, isSoapFault.
- Adjust i18n mapping in `DEFAULT_ERROR_I18N_KEYS` to match your translation keys.
