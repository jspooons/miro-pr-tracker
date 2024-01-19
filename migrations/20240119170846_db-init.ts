import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('Auth', function (table) {
        table.increments('id').primary();
        table.string('miroUserId').unique();
        table.string('gitToken').unique();
        table.string('gitUserName').unique();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('UpdatedAt').defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('Dashboard', function (table) {
        table.increments('id').primary();
        table.string('miroBoardId');
        table.string('repoOwner');
        table.string('repoOwnerType');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('UpdatedAt').defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('PullRequestMapping', function (table) {
        table.increments('id').primary();
        table.integer('dashboardId');
        table.string('miroBoardId');
        table.string('miroAppCardId').unique();
        table.integer('pullNumber');
        table.string('repoName');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('UpdatedAt').defaultTo(knex.fn.now());
      
        table.foreign('dashboardId').references('id').inTable('Dashboard');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('PullRequestMapping');
    await knex.schema.dropTableIfExists('Dashboard');
    await knex.schema.dropTableIfExists('Auth');
  }

