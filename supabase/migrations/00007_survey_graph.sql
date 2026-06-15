-- Enable optional public quadrant graph for survey responses
alter table survey_config
  add column if not exists show_graph boolean not null default false;
