export interface DisplayCondition {
  type: 'visibility' | 'setter' | 'limiter' | 'formula' | 'filter';
  field: string;
  rule: 'equals' | 'over' | 'onchange' | 'ondisable' | 'session' | 'systemtime';
  value: any;
  action: 'set' | 'show' | 'disabled' | 'hide' | 'min';
}
